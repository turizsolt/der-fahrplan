import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { babylonContainer } from './structs/inversify.config';
import { Land } from './structs/Land/Land';
import { TYPES } from './structs/TYPES';
import { GridDrawer } from './controllers/GridDrawer';
import { InputController } from './controllers/InputController';

window.addEventListener('DOMContentLoaded', () => {
  const canvas: BABYLON.Nullable<HTMLCanvasElement> = document.getElementById(
    'renderCanvas'
  ) as HTMLCanvasElement;
  const renderEngine = new BABYLON.Engine(canvas, true);
  let camera: BABYLON.ArcRotateCamera;
  const createScene = () => {
    const scene = new BABYLON.Scene(renderEngine);
    scene.clearColor = new BABYLON.Color4(0, 1, 0, 1);

    camera = new BABYLON.ArcRotateCamera(
      'Camera',
      0,
      0,
      180, // 300,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );

    const light = new BABYLON.DirectionalLight(
      'DirectionalLight',
      new BABYLON.Vector3(0, -1, 0),
      scene
    );
    light.intensity = 0.7;

    const pol = new BABYLON.PointLight('pl', BABYLON.Vector3.Zero(), scene);
    pol.diffuse = new BABYLON.Color3(1, 1, 1);
    pol.specular = new BABYLON.Color3(1, 1, 1);
    pol.intensity = 0.8;

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
});
