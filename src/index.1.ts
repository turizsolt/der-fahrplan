import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { productionContainer } from './di/production.config';
import { Land } from './structs/Interfaces/Land';
import { TYPES } from './di/TYPES';
import { GridDrawer } from './ui/controllers/GridDrawer';
import { GlobalController } from './ui/controllers/GlobalController';
import { MeshProvider } from './ui/babylon/MeshProvider';
import { BabylonController } from './ui/controllers/BabylonController';
import { KeyboardInputs } from './KeyboardInputs';

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

    const keyboardInputs = new KeyboardInputs(globalController);
    scene.registerAfterRender(() => {
      keyboardInputs.fireKeyHolds();
      globalController.tick();
    });

    return { scene, camera };
  };
  const { scene, camera } = createScene();

  const specificController = new BabylonController(scene, camera);
  const globalController = new GlobalController(specificController);
  const land = productionContainer.get<Land>(TYPES.Land);
  land.init(globalController);

  renderEngine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    renderEngine.resize();
  });

  canvas.addEventListener('pointerdown', e => {
    globalController.down(e);
    if (e.button === 1) {
      e.preventDefault();
      return false;
    }
  });

  canvas.addEventListener('pointerup', e => {
    globalController.up(e);
  });

  canvas.addEventListener('pointermove', e => {
    globalController.move(e);
  });

  canvas.addEventListener('pointerenter', () => {});

  canvas.addEventListener('pointerleave', e => {
    globalController.up(e);
  });

  canvas.addEventListener('focus', () => {});

  canvas.addEventListener('blur', () => {});

  window.addEventListener('wheel', e => {
    globalController.wheel(e);
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
