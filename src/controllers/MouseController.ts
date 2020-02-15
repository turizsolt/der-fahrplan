import * as BABYLON from 'babylonjs';
import { Engine } from '../structs/Engine/Engine';

export class MouseController {
  private scene: BABYLON.Scene;

  constructor() {}

  setScene(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  handleMouseDown() {}

  handleMouseUp() {}

  handleMouseMove() {}
}
