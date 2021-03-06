import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { CoordinateToBabylonVector3 } from '../../ui/babylon/converters/CoordinateToBabylonVector3';
import { ActualTrack } from '../../structs/Actuals/Track/ActualTrack';
import { productionContainer } from '../../di/production.config';
import { TYPES } from '../../di/TYPES';
import { Track } from '../../structs/Interfaces/Track';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { getPredefinedWagonConfig } from '../../structs/Actuals/Wagon/ActualWagonConfigs';
import { Store } from '../../structs/Interfaces/Store';

export class CreateEngineInputHandler implements InputHandler {
  private fromMesh: BABYLON.Mesh;

  private store: Store;

  constructor() {
    this.store = productionContainer.get<() => Store>(TYPES.FactoryOfStore)();

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
          .getSegment()
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
      const wagon = this.store
        .create<Wagon>(TYPES.Wagon)
        .init(getPredefinedWagonConfig(downProps.wagonType));
      wagon.putOnTrack(dpot.track as Track, dpot.position);
    }

    this.fromMesh.setEnabled(false);
  }

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {}

  cancel(): void {
    this.fromMesh.setEnabled(false);
  }
}
