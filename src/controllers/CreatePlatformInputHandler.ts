import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { Coordinate } from '../structs/Geometry/Coordinate';
import { InputProps } from './InputProps';
import { curveToTube } from '../structs/Track/TrackBabylonRenderer';
import { BezierCreater } from '../structs/Geometry/Bezier/BezierCreater';
import { CoordinateToBabylonVector3 } from '../structs/CoordinateToBabylonVector3';
import { ActualTrack } from '../structs/Track/ActualTrack';
import { Platform } from '../structs/Platform/Platform';
import { babylonContainer } from '../structs/inversify.config';
import { TYPES } from '../structs/TYPES';
import { Side } from '../structs/Platform/Side';
import { PassengerGenerator } from '../structs/Platform/PassengerGenerator';
import { Color3 } from 'babylonjs';
import { Color } from '../structs/Color';

export class CreatePlatformInputHandler implements InputHandler {
  private fromMesh: BABYLON.Mesh;
  private toMesh: BABYLON.Mesh;
  private pathMesh: BABYLON.Mesh;

  private passengerGenerator: PassengerGenerator;
  private platformFactory: () => Platform;

  constructor() {
    this.platformFactory = babylonContainer.get<() => Platform>(
      TYPES.FactoryOfPlatform
    );
    this.passengerGenerator = new PassengerGenerator([], null);

    const mat = new BABYLON.StandardMaterial('boxMat', null);
    mat.diffuseColor = new BABYLON.Color3(0, 1, 0);

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

    this.toMesh = BABYLON.MeshBuilder.CreateCylinder(
      'placeholder-2',
      {
        diameter: 3,
        tessellation: 24,
        height: 10,
        updatable: true
      },
      null
    );
    this.toMesh.material = mat;
    this.toMesh.setEnabled(false);
    this.toMesh.isPickable = false;

    this.pathMesh = curveToTube(
      BezierCreater.Create([
        new Coordinate(0, 0, 0),
        new Coordinate(0, 0, 1),
        new Coordinate(0, 0, 2)
      ])
        .getLinePoints()
        .map(CoordinateToBabylonVector3),
      false
    );
    this.pathMesh.setEnabled(false);
  }

  down(props: InputProps, event: PointerEvent): void {
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

  move(downProps: InputProps, props: InputProps, event: PointerEvent): void {
    const pot = props.snappedPositionOnTrack;
    if (pot && pot.track.constructor.name === ActualTrack.name) {
      this.toMesh.position = CoordinateToBabylonVector3(
        pot.track
          .getSegment()
          .getBezier()
          .getPoint(pot.position)
      );

      //   const a = pot.track.getSegment().getFirstPoint();
      //   const b = pot.track.getSegment().getLastPoint();
      //   const p = props.point.coord;
      //   const side = Math.sign(
      //     (b.x - a.x) * (p.z - a.z) - (b.z - a.z) * (p.x - a.x)
      //   );

      // console.log(side);

      this.toMesh.setEnabled(!!pot);
    } else {
      this.toMesh.setEnabled(false);
    }
  }

  click(downProps: InputProps, event: PointerEvent): void {
    this.fromMesh.setEnabled(false);
    this.toMesh.setEnabled(false);
    this.pathMesh.setEnabled(false);
  }

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {
    const pot = props.snappedPositionOnTrack;
    const dpot = downProps.snappedPositionOnTrack;

    if (
      pot &&
      dpot &&
      pot.track.constructor.name === ActualTrack.name &&
      pot.track === dpot.track &&
      pot.position !== dpot.position
    ) {
      const a = pot.track.getSegment().getFirstPoint();
      const b = pot.track.getSegment().getLastPoint();
      const p = props.point.coord;
      const side = Math.sign(
        (b.x - a.x) * (p.z - a.z) - (b.z - a.z) * (p.x - a.x)
      );

      // console.log(side, p.x, p.y, p.z);

      const pl = this.platformFactory().init(
        randomName(),
        pot.track,
        Math.min(pot.position, dpot.position),
        Math.max(pot.position, dpot.position),
        5,
        side > 0 ? Side.Left : Side.Right,
        randomColor()
      );
      this.passengerGenerator.addToList(pl);
    }

    this.fromMesh.setEnabled(false);
    this.toMesh.setEnabled(false);
    this.pathMesh.setEnabled(false);
  }

  cancel(): void {
    this.fromMesh.setEnabled(false);
    this.toMesh.setEnabled(false);
    this.pathMesh.setEnabled(false);
  }
}

function randomName() {
  let v = '';
  for (let i = 0; i < 6; i++) {
    v += '0123456789abcdef'.charAt[(Math.random() * 16) | 0];
  }
  return v;
}

function randomColor() {
  return new Color(Math.random(), Math.random(), Math.random());
}
