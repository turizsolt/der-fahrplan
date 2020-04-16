import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { CoordinateToBabylonVector3 } from '../../ui/babylon/converters/CoordinateToBabylonVector3';
import { ActualTrack } from '../../structs/Actuals/Track/ActualTrack';
import { productionContainer } from '../../di/production.config';
import { TYPES } from '../../di/TYPES';
import { Track } from '../../structs/Interfaces/Track';
import { Wagon } from '../../structs/Interfaces/Wagon';

export class CreateEngineInputHandler implements InputHandler {
  private fromMesh: BABYLON.Mesh;

  private wagonFactory: () => Wagon;

  constructor() {
    this.wagonFactory = productionContainer.get<() => Wagon>(
      TYPES.FactoryOfWagon
    );

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
      //const engine = this.engineFactory().init();
      //engine.putOnTrack(dpot.track as Track, dpot.position);
      const wagon = this.wagonFactory().init();
      wagon.putOnTrack(dpot.track as Track, dpot.position);

      //   const pot = new PositionOnTrack(dpot.track, null, dpot.position, 1);
      //   pot.hop(14);
      //   pot.hop(1);
      //   const wagon2 = this.wagonFactory().init();
      //   wagon2.putOnTrack(pot.getTrack() as Track, pot.getPercentage());
      //   wagon.getB().connect(wagon2.getA());

      //   pot.hop(14);
      //   pot.hop(1);
      //   const wagon3 = this.wagonFactory().init();
      //   wagon3.putOnTrack(pot.getTrack() as Track, pot.getPercentage());
      //   wagon2.getB().connect(wagon3.getA());

      //   pot.hop(14);
      //   pot.hop(1);
      //   const wagon4 = this.wagonFactory().init();
      //   wagon4.putOnTrack(pot.getTrack() as Track, pot.getPercentage());
      //   wagon3.getB().connect(wagon4.getA());
    }

    this.fromMesh.setEnabled(false);
  }

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {}

  cancel(): void {
    this.fromMesh.setEnabled(false);
  }
}
