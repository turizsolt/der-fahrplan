import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { CoordinateToBabylonVector3 } from '../../ui/babylon/converters/CoordinateToBabylonVector3';
import { ActualTrack } from '../../modules/Track/ActualTrack';
import { Track } from '../../modules/Track/Track';
import { getPredefinedWagonConfig } from '../../structs/Actuals/Wagon/ActualWagonConfigs';
import { Store } from '../../structs/Interfaces/Store';
import { CommandCreator } from '../../structs/Actuals/Store/Command/CommandCreator';
import { GENERATE_ID } from '../../structs/Actuals/Store/Command/CommandLog';

export class CreateEngineInputHandler implements InputHandler {
  private fromMesh: BABYLON.Mesh;

  constructor(private store: Store) {
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

  down(props: InputProps, event: PointerEvent): void {}

  roam(props: InputProps, event: PointerEvent): void {
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

  move(downProps: InputProps, props: InputProps, event: PointerEvent): void {}

  click(downProps: InputProps, event: PointerEvent): void {
    const dpot = downProps.snappedPositionOnTrack;

    if (dpot && dpot.track.constructor.name === ActualTrack.name) {
      this.store.getCommandLog().addAction(
        CommandCreator.createTrain(
          GENERATE_ID,
          GENERATE_ID,
          getPredefinedWagonConfig('wagon'), // todo downProps.wagonType),
          (dpot.track as Track).getId(),
          dpot.position,
          1
        )
      );
    }

    this.fromMesh.setEnabled(false);
  }

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {}

  cancel(): void {
    this.fromMesh.setEnabled(false);
  }
}
