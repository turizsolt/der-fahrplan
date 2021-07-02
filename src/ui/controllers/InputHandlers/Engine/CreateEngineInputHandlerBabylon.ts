import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from '../../../babylon/converters/CoordinateToBabylonVector3';
import { CreateEngineInputHandlerPlugin } from './CreateEngineInputHandlerPlugin';
import { Coordinate } from '../../../../structs/Geometry/Coordinate';

export class CreateEngineInputHandlerBabylon
  implements CreateEngineInputHandlerPlugin {
  private fromMesh: BABYLON.Mesh;

  constructor() {}

  init() {
    const mat = new BABYLON.StandardMaterial('boxMat', null);
    mat.diffuseColor = new BABYLON.Color3(0, 1, 1);

    this.fromMesh = BABYLON.MeshBuilder.CreateCylinder(
      'placeholder-1',
      {
        diameter: 3,
        tessellation: 24,
        height: 10,
        updatable: true
      },
      null
    );
    this.fromMesh.material = mat;
    this.fromMesh.setEnabled(false);
    this.fromMesh.isPickable = false;
  }

  roam(renderable: boolean, point?: Coordinate): void {
    this.fromMesh.setEnabled(renderable);

    if (point) {
      this.fromMesh.position = CoordinateToBabylonVector3(point);
    }
  }

  click() {
    this.fromMesh.setEnabled(false);
  }

  cancel() {
    this.fromMesh.setEnabled(false);
  }
}
