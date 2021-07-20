import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { CoordinateToBabylonVector3 } from '../babylon/converters/CoordinateToBabylonVector3';
import { ActualTrack } from '../../modules/Track/ActualTrack';
import { TYPES } from '../../di/TYPES';
import { Store } from '../../structs/Interfaces/Store';
import { Signal } from '../../modules/Signaling/Signal';
import { PositionOnTrack } from '../../modules/Train/PositionOnTrack';
import { TrackDirection } from '../../modules/Track/TrackDirection';

export class CreateSignalInputHandler implements InputHandler {
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
      /*this.store
        .getCommandLog()
        .addAction(
          CommandCreator.createTrain(
            GENERATE_ID,
            GENERATE_ID,
            getPredefinedWagonConfig(downProps.wagonType),
            (dpot.track as Track).getId(),
            dpot.position,
            1
          )
        );*/
      const signal = this.store
        .create<Signal>(TYPES.Signal)
        .init(
          PositionOnTrack.fromTrack(
            dpot.track,
            dpot.track.getLength() * dpot.position,
            TrackDirection.AB
          )
        );
      const signal2 = this.store
        .create<Signal>(TYPES.Signal)
        .init(
          PositionOnTrack.fromTrack(
            dpot.track,
            dpot.track.getLength() * (1 - dpot.position),
            TrackDirection.BA
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
