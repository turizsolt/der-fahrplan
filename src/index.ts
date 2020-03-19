import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { babylonContainer } from './structs/inversify.config';
import { Land } from './structs/Interfaces/Land';
import { TYPES } from './structs/TYPES';
import { GridDrawer } from './ui/controllers/GridDrawer';
import { InputController } from './ui/controllers/InputController';
import { MeshProvider } from './ui/babylon/MeshProvider';

window.addEventListener('DOMContentLoaded', () => {
  const canvas: BABYLON.Nullable<HTMLCanvasElement> = document.getElementById(
    'renderCanvas'
  ) as HTMLCanvasElement;
  const renderEngine = new BABYLON.Engine(canvas, true);
  let camera: BABYLON.ArcRotateCamera;
  const createScene = () => {
    const scene = new BABYLON.Scene(renderEngine);

    const meshProviderFactory = babylonContainer.get<() => MeshProvider>(
      TYPES.FactoryOfMeshProvider
    );
    const meshProvider = meshProviderFactory().init(scene);

    scene.clearColor = new BABYLON.Color4(0, 1, 0, 1);

    camera = new BABYLON.ArcRotateCamera(
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
    const land = babylonContainer.get<Land>(TYPES.Land);
    land.init();

    const gridDrawer = new GridDrawer();
    gridDrawer.setScene(scene);
    gridDrawer.drawGrid();

    this.scene = scene;
    this.map = {};
    this.scene.actionManager = new BABYLON.ActionManager(this.scene);

    const modifier = key => {
      const list = ['Shift', 'Control', 'Alt'];
      return list.includes(key);
    };

    const upper = key => {
      return key[0].toUpperCase() + key.slice(1);
    };

    this.scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyDownTrigger,
        evt => {
          const key = upper(evt.sourceEvent.key);
          if (!this.map[key]) {
            if (!modifier(key)) {
              inputController.keyDown(key, {
                shift: this.map['Shift'],
                ctrl: this.map['Control']
              });
            }
          }
          this.map[key] = evt.sourceEvent.type == 'keydown';
        }
      )
    );

    this.scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyUpTrigger,
        evt => {
          const key = upper(evt.sourceEvent.key);
          if (!modifier(key)) {
            inputController.keyUp(key, {
              shift: this.map['Shift'],
              ctrl: this.map['Control']
            });
          }

          this.map[key] = evt.sourceEvent.type == 'keydown';
        }
      )
    );

    this.scene.registerAfterRender(() => {
      for (let key of Object.keys(this.map)) {
        if (this.map[key] && !modifier(key)) {
          inputController.keyHold(key, {
            shift: this.map['Shift'],
            ctrl: this.map['Control']
          });
        }
      }
    });

    return scene;
  };
  const scene = createScene();

  const inputController = new InputController(scene, camera);

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

  canvas.addEventListener('pointerleave', () => {});

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
        files = event.dataTransfer.files,
        len = files.length;

      for (; i < len; i++) {
        var reader = new FileReader();
        reader.onload = function(event) {
          var contents = (event.target as any).result;

          try {
            const obj = JSON.parse(contents);

            if (!obj._version) throw new Error();
            if (!obj._format || obj._format !== 'fahrplan') throw new Error();
            inputController.load(obj.data);
          } catch {
            console.error('Not proper JSON, hey!');
          }
        };

        reader.onerror = function(event) {
          console.error(
            'File could not be read! Code ' + (event.target as any).error.code
          );
        };

        reader.readAsText(files[i]);
      }
    },
    false
  );
});
