import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { TrackJoint } from './structs/TrackJoint/TrackJoint';
import { babylonContainer } from './structs/inversify.config';
import { Land } from './structs/Land/Land';
import { TYPES } from './structs/TYPES';
import { KeyController } from './controllers/KeyController';
import { GridDrawer } from './controllers/GridDrawer';
import { MouseController } from './controllers/MouseController';
import { OldController } from './controllers/OldController';
import { InputController } from './controllers/InputController';
import { BabylonVector3ToCoordinate } from './structs/BabylonVector3ToCoordinate';

window.addEventListener('DOMContentLoaded', () => {
  const canvas: BABYLON.Nullable<HTMLCanvasElement> = document.getElementById(
    'renderCanvas'
  ) as HTMLCanvasElement;
  const renderEngine = new BABYLON.Engine(canvas, true);

  //   const controller = new OldController();

  const createScene = () => {
    const scene = new BABYLON.Scene(renderEngine);
    scene.clearColor = new BABYLON.Color4(0, 1, 0, 1);

    const camera = new BABYLON.ArcRotateCamera(
      'Camera',
      1,
      0.8,
      180, // 300,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    // controller.setCameraAndCanvas(camera, canvas as HTMLElement);

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
    const engine = land.init(null); //controller);

    const gridDrawer = new GridDrawer();
    gridDrawer.setScene(scene);
    gridDrawer.drawGrid();

    // const keyController = new KeyController();
    // keyController.setScene(scene);
    // keyController.setController(controller);
    // keyController.handleKeys();
    // keyController.handleKeyCommands(engine);

    return scene;
  };
  const scene = createScene();
  //   controller.setScene(scene);
  //   const mouseController = new MouseController();
  //   mouseController.setScene(scene);
  //   mouseController.setController(controller);

  const inputController = new InputController(scene);

  renderEngine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    renderEngine.resize();
  });

  canvas.addEventListener('pointerdown', e => {
    inputController.down(e);
  });

  canvas.addEventListener('pointerup', e => {
    inputController.up(e);
  });

  canvas.addEventListener('pointermove', e => {
    inputController.move(e);
  });

  canvas.addEventListener('pointerenter', () => {
    console.log('enter');
  });

  canvas.addEventListener('pointerleave', () => {
    console.log('leave');
  });

  window.addEventListener('wheel', e => {
    inputController.wheel(e);
  });
});
