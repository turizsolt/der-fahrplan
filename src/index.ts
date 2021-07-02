import * as PIXI from 'pixi.js';
import * as BABYLON from 'babylonjs';
import { productionContainer2d } from './di/production.2d.config';
import { productionContainer3d } from './di/production.3d.config';
import { GlobalController } from './ui/controllers/GlobalController';
import { Land } from './structs/Interfaces/Land';
import { TYPES } from './di/TYPES';
import { PixiController } from './ui/controllers/PixiController';
import { KeyboardInputs } from './KeyboardInputs';
import { Store } from './structs/Interfaces/Store';
import { BabylonController } from './ui/controllers/BabylonController';
import { GridDrawer } from './ui/controllers/GridDrawer';
import { MeshProvider } from './ui/babylon/MeshProvider';

const productionContainer =
  globalThis.startParam === '2d'
    ? productionContainer2d
    : productionContainer3d;

if (globalThis.startParam === '2d') {
  // init PIXI
  const app = new PIXI.Application({ width: 512, height: 512 });
  document.getElementById('renderCanvas').appendChild(app.view);
  app.renderer.backgroundColor = 0xcceecc;
  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.display = 'block';
  app.renderer.resize(window.innerWidth, window.innerHeight);
  app.renderer.view.style.zIndex = '0';
  app.view.id = 'renderCanvasInner';

  // draw the grid
  const HEIGHT = (10 * Math.sqrt(3)) / 2;
  const WIDTH = 10;

  let line = new PIXI.Graphics();
  line.lineStyle(0.25, 0x000000, 0.25);
  for (let i = -50; i < 50; i++) {
    line.moveTo(-50 * WIDTH, i * HEIGHT);
    line.lineTo(50 * WIDTH, i * HEIGHT);

    line.moveTo((-50 * WIDTH) / 2 + i * WIDTH, -50 * HEIGHT);
    line.lineTo((50 * WIDTH) / 2 + i * WIDTH, 50 * HEIGHT);

    line.moveTo((50 * WIDTH) / 2 + i * WIDTH, -50 * HEIGHT);
    line.lineTo((-50 * WIDTH) / 2 + i * WIDTH, 50 * HEIGHT);
  }
  app.stage.scale.x = 3;
  app.stage.scale.y = 3;
  app.stage.addChild(line);
  // todo global
  globalThis.stage = app.stage;
  globalThis.renderer = app.renderer;

  // listeners
  window.addEventListener('DOMContentLoaded', () => {
    const specificController = new PixiController();
    const store = productionContainer.get<() => Store>(TYPES.FactoryOfStore)();
    const globalController = new GlobalController(store, specificController);
    const inputController = globalController.getInputController();
    const land = productionContainer.get<Land>(TYPES.Land);
    land.init(globalController);

    // todo global
    globalThis.globalController = globalController;
    globalThis.inputController = inputController;

    app.stage.on('pointerdown', (event: PIXI.InteractionEvent) => {
      const x = (event.data.global.x - app.stage.x) / app.stage.scale.x;
      const y = (event.data.global.y - app.stage.y) / app.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      inputController.down({ ...event, button: event.data.button } as any);
    });

    app.stage.on('pointerup', (event: PIXI.InteractionEvent) => {
      const x = (event.data.global.x - app.stage.x) / app.stage.scale.x;
      const y = (event.data.global.y - app.stage.y) / app.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      inputController.up({ ...event, button: event.data.button } as any);
    });

    app.stage.on('pointermove', (event: PIXI.InteractionEvent) => {
      const x = (event.data.global.x - app.stage.x) / app.stage.scale.x;
      const y = (event.data.global.y - app.stage.y) / app.stage.scale.y;
      event.data.global.x = x;
      event.data.global.y = y;
      inputController.move({ ...event, button: event.data.button } as any);
    });

    app.stage.interactive = true; // This can't be forgotten
    app.stage.sortableChildren = true;

    app.stage.hitArea = new PIXI.Rectangle(
      -500,
      -500,
      1000, // window.innerWidth,
      1000 // window.innerHeight
    );

    const onMouseUpdate = e => {
      globalThis.pointer = { x: e.pageX, y: e.pageY };
    };

    const canvas: BABYLON.Nullable<HTMLCanvasElement> = document.getElementById(
      'renderCanvas'
    ) as HTMLCanvasElement;

    canvas.addEventListener('mousemove', onMouseUpdate, false);
    canvas.addEventListener('mouseenter', onMouseUpdate, false);

    window.addEventListener('mousewheel', (event: any) => {
      inputController.wheel(event);
    });

    document.addEventListener('contextmenu', e => {
      e.preventDefault();
      return false;
    });
    document.addEventListener(
      'dragover',
      function(event) {
        event.preventDefault();
      },
      false
    );

    document.addEventListener(
      'drop',
      function(event) {
        // cancel default actions
        event.preventDefault();

        var i = 0,
          files = event && event.dataTransfer && event.dataTransfer.files,
          len = (files && files.length) || 0;

        for (; i < len; i++) {
          var reader = new FileReader();
          reader.onload = function(event) {
            var contents = (event.target as any).result;

            try {
              const obj = JSON.parse(contents);

              if (!obj._version) throw new Error();
              if (obj._version != 2) throw new Error();
              if (!obj._format || obj._format !== 'fahrplan') throw new Error();
              globalController.load(obj.data);
              globalController.loadSpecific(obj);
            } catch {
              console.error('Not proper JSON, hey!');
            }
          };

          reader.onerror = function(event) {
            console.error(
              'File could not be read! Code ' + (event.target as any).error.code
            );
          };

          if (files) reader.readAsText(files[i]);
        }
      },
      false
    );

    const keyboardInputs = new KeyboardInputs(inputController);
    app.ticker.add(delta => {
      keyboardInputs.fireKeyHolds();
      inputController.tick();
      globalController.tick();
    });
  });
} else {
  window.addEventListener('DOMContentLoaded', () => {
    const canvas: BABYLON.Nullable<HTMLCanvasElement> = document.getElementById(
      'renderCanvas'
    ) as HTMLCanvasElement;
    const renderEngine = new BABYLON.Engine(canvas, true);
    const createScene = () => {
      const scene = new BABYLON.Scene(renderEngine);

      const meshProviderFactory = productionContainer.get<() => MeshProvider>(
        TYPES.FactoryOfMeshProvider
      );
      const meshProvider = meshProviderFactory();
      meshProvider.setScene(scene);

      scene.clearColor = new BABYLON.Color4(0, 1, 0, 1);

      const camera = new BABYLON.ArcRotateCamera(
        'Camera',
        0,
        0.8,
        70,
        new BABYLON.Vector3(0, 0, 30),
        scene
      );

      const light = new BABYLON.HemisphericLight(
        'HemiLight',
        new BABYLON.Vector3(0, 1, 0),
        scene
      );

      (window as any).switches = [];

      const gridDrawer = new GridDrawer();
      gridDrawer.setScene(scene);
      gridDrawer.drawGrid();

      scene.actionManager = new BABYLON.ActionManager(scene);

      return { scene, camera };
    };
    const { scene, camera } = createScene();

    const specificController = new BabylonController(scene, camera);
    const store = productionContainer.get<() => Store>(TYPES.FactoryOfStore)();
    const globalController = new GlobalController(store, specificController);
    const inputController = globalController.getInputController();

    const keyboardInputs = new KeyboardInputs(inputController);
    scene.registerAfterRender(() => {
      keyboardInputs.fireKeyHolds();
      inputController.tick();
      globalController.tick();
    });

    const land = productionContainer.get<Land>(TYPES.Land);
    land.init(globalController);

    renderEngine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', () => {
      renderEngine.resize();
    });

    canvas.addEventListener('pointerdown', e => {
      inputController.down(e);
      if (e.button === 1) {
        e.preventDefault();
        return false;
      }
    });

    canvas.addEventListener('pointerup', e => {
      inputController.up(e);
    });

    canvas.addEventListener('pointermove', e => {
      inputController.move(e);
    });

    canvas.addEventListener('pointerenter', () => {});

    canvas.addEventListener('pointerleave', e => {
      inputController.up(e);
    });

    canvas.addEventListener('focus', () => {});

    canvas.addEventListener('blur', () => {});

    window.addEventListener('wheel', e => {
      inputController.wheel(e);
    });

    document.addEventListener('contextmenu', e => {
      e.preventDefault();
      return false;
    });
    document.addEventListener(
      'dragover',
      function(event) {
        event.preventDefault();
      },
      false
    );

    document.addEventListener(
      'drop',
      function(event) {
        // cancel default actions
        event.preventDefault();

        var i = 0,
          files = event && event.dataTransfer && event.dataTransfer.files,
          len = (files && files.length) || 0;

        for (; i < len; i++) {
          var reader = new FileReader();
          reader.onload = function(event) {
            var contents = (event.target as any).result;

            try {
              const obj = JSON.parse(contents);

              if (!obj._version) throw new Error();
              if (obj._version != 2) throw new Error();
              if (!obj._format || obj._format !== 'fahrplan') throw new Error();
              globalController.load(obj.data);
              globalController.loadSpecific(obj);
            } catch {
              console.error('Not proper JSON, hey!');
            }
          };

          reader.onerror = function(event) {
            console.error(
              'File could not be read! Code ' + (event.target as any).error.code
            );
          };

          if (files) reader.readAsText(files[i]);
        }
      },
      false
    );
  });
}
