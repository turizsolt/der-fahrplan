import * as BABYLON from 'babylonjs';
import { Controller } from './Controller';

export class MouseController {
  private scene: BABYLON.Scene;
  private controller: Controller;

  constructor() {}

  setScene(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  setController(controller: Controller) {
    this.controller = controller;
  }

  handleMouseDown() {
    const { pickedPoint } = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );

    this.controller.createJoint(pickedPoint);
  }

  handleMouseUp() {}

  handleMouseMove() {
    const { pickedPoint } = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
    );

    this.controller.setMousePoint(pickedPoint);
  }
}
