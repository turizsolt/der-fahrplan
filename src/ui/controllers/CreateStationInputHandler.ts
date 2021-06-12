import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { InputProps } from './InputProps';
import { TYPES } from '../../di/TYPES';
import { CoordinateToBabylonVector3 } from '../babylon/converters/CoordinateToBabylonVector3';
import { Station } from '../../structs/Scheduling/Station';
import { Circle } from '../../structs/Geometry/Circle';
import { Store } from '../../structs/Interfaces/Store';

export class CreateStationInputHandler implements InputHandler {
  private fromMesh: BABYLON.Mesh;
  private toMesh: BABYLON.Mesh;

  constructor(private store: Store) {
    this.fromMesh = BABYLON.MeshBuilder.CreateBox(
      'name',
      { height: 1, width: 1, depth: 1 },
      null
    );
    this.fromMesh.setEnabled(false);
    this.fromMesh.isPickable = false;

    this.toMesh = BABYLON.MeshBuilder.CreateBox(
      'name',
      { height: 1, width: 1, depth: 1 },
      null
    );
    this.toMesh.setEnabled(false);
    this.toMesh.isPickable = false;
  }

  down(props: InputProps, event: PointerEvent): void {
    if (!props.snappedJoint) {
      this.fromMesh.setEnabled(
        !props.snappedJoint && !props.snappedPositionOnTrack
      );
      this.fromMesh.position = CoordinateToBabylonVector3(
        props.snappedPoint.coord
      );
      this.fromMesh.position.y = 0.75;
    }

    this.toMesh.setEnabled(
      !props.snappedJoint && !props.snappedPositionOnTrack
    );
    this.toMesh.position = CoordinateToBabylonVector3(props.snappedPoint.coord);
    this.toMesh.position.y = 0.75;
  }

  roam(props: InputProps, event: PointerEvent): void {
    if (props.snappedPoint) {
      this.fromMesh.position = CoordinateToBabylonVector3(
        props.snappedPoint.coord
      );
      this.fromMesh.position.y = 0.75;
    }
    this.fromMesh.setEnabled(
      !props.snappedJoint && !props.snappedPositionOnTrack
    );
  }

  move(downProps: InputProps, props: InputProps, event: PointerEvent): void {
    this.toMesh.position = CoordinateToBabylonVector3(props.snappedPoint.coord);
    this.toMesh.position.y = 0.75;
    this.toMesh.setEnabled(!props.snappedJoint);

    if (props.snappedJoint) {
      props.snappedPoint.dirXZ = props.snappedJoint.getRotation();
    }

    if (downProps.snappedJoint) {
      downProps.snappedPoint.dirXZ = downProps.snappedJoint.getRotation();
    }
  }

  click(downProps: InputProps, event: PointerEvent): void {}

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {
    if (
      !downProps.snappedPoint.coord.equalsTo(props.snappedPoint.coord) &&
      (!props.snappedJointOnTrack ||
        props.snappedJointOnTrack.position === 0 ||
        props.snappedJointOnTrack.position === 1) &&
      (!downProps.snappedJointOnTrack ||
        downProps.snappedJointOnTrack.position === 0 ||
        downProps.snappedJointOnTrack.position === 1)
    ) {
      const station = this.store.create<Station>(TYPES.Station);
      const diam = downProps.snappedPoint.coord.distance2d(
        props.snappedPoint.coord
      );
      const pt = downProps.snappedPoint.coord.midpoint(
        props.snappedPoint.coord
      );
      station.init(new Circle(pt, diam / 2));
    }
    this.fromMesh.setEnabled(false);
    this.toMesh.setEnabled(false);
  }

  cancel(): void {
    this.fromMesh.setEnabled(false);
    this.toMesh.setEnabled(false);
  }
}
