import * as BABYLON from 'babylonjs';
import { CoordinateToBabylonVector3 } from '../../babylon/converters/CoordinateToBabylonVector3';
import { InputProps } from '../InputProps';
import { CreateEngineInputHandlerPlugin } from './CreateEngineInputHandlerPlugin';
import { ActualTrack } from '../../../modules/Track/ActualTrack';

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

  roam(props: InputProps) {
    const pot = props.snappedPositionOnTrack;
    if (pot && pot.track.constructor.name === ActualTrack.name) {
      this.fromMesh.position = CoordinateToBabylonVector3(
        pot.track
          .getCurve()
          .getBezier()
          .getPoint(pot.position)
      );

      this.fromMesh.setEnabled(!!pot);
    } else {
      this.fromMesh.setEnabled(false);
    }
  }

  click() {
    this.fromMesh.setEnabled(false);
  }

  cancel() {
    this.fromMesh.setEnabled(false);
  }
}
