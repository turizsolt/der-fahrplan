import * as BABYLON from 'babylonjs';
import { curveToTube } from '../../../babylon/TrackBabylonRenderer';
import { BezierCreater } from '../../../../structs/Geometry/Bezier/BezierCreater';
import { Coordinate } from '../../../../structs/Geometry/Coordinate';
import { CoordinateToBabylonVector3 } from '../../../babylon/converters/CoordinateToBabylonVector3';
import { InputProps } from '../../InputProps';
import { TrackInputHandlerPlugin } from './TrackInputHandlerPlugin';

export class TrackInputHandlerBabylon implements TrackInputHandlerPlugin {
  private fromMesh: BABYLON.Mesh;
  private toMesh: BABYLON.Mesh;
  private pathMesh: BABYLON.Mesh;
  private dir: number = 0;

  constructor() {}

  init() {
    this.fromMesh = BABYLON.MeshBuilder.CreateBox(
      'name',
      { height: 1.5, width: 1, depth: 2 },
      null
    );
    this.fromMesh.setEnabled(false);
    this.fromMesh.isPickable = false;

    this.toMesh = BABYLON.MeshBuilder.CreateBox(
      'name',
      { height: 1.5, width: 1, depth: 2 },
      null
    );
    this.toMesh.setEnabled(false);
    this.toMesh.isPickable = false;

    this.pathMesh = curveToTube(
      BezierCreater.Create([
        new Coordinate(0, 0, 0),
        new Coordinate(0, 0, 1),
        new Coordinate(0, 0, 2)
      ])
        .getLineSegmentChain()
        .getRays()
        .map(x => CoordinateToBabylonVector3(x.setY(1.25).coord)),
      false
    );
    this.pathMesh.setEnabled(false);
  }

  down(props: InputProps) {
    if (!props.snappedJoint) {
      this.fromMesh.setEnabled(
        !props.snappedJoint && !props.snappedPositionOnTrack
      );
      this.fromMesh.position = CoordinateToBabylonVector3(
        props.snappedPoint.coord
      );
      this.fromMesh.position.y = 0.75;
      this.fromMesh.rotation.y = this.dir;
    }

    this.toMesh.setEnabled(
      !props.snappedJoint && !props.snappedPositionOnTrack
    );
    this.toMesh.position = CoordinateToBabylonVector3(props.snappedPoint.coord);
    this.toMesh.position.y = 0.75;
    this.toMesh.rotation.y = this.dir;

    this.pathMesh = curveToTube(
      BezierCreater.Create([props.snappedPoint.coord, props.snappedPoint.coord])
        .getLineSegmentChain()
        .getRays()
        .map(x => CoordinateToBabylonVector3(x.setY(1.25).coord)),
      false,
      this.pathMesh
    );
    this.pathMesh.setEnabled(!props.snappedJoint);
  }

  roam(props: InputProps) {
    if (props.snappedPoint) {
      this.fromMesh.position = CoordinateToBabylonVector3(
        props.snappedPoint.coord
      );
      this.fromMesh.position.y = 0.75;
    }
    this.fromMesh.rotation.y = this.dir;
    this.fromMesh.setEnabled(
      !props.snappedJoint && !props.snappedPositionOnTrack
    );
  }

  move(downProps: InputProps, props: InputProps) {
    this.toMesh.position = CoordinateToBabylonVector3(props.snappedPoint.coord);
    this.toMesh.position.y = 0.75;
    this.toMesh.rotation.y = this.dir;
    this.toMesh.setEnabled(!props.snappedJoint);

    const midpoint = downProps.snappedPoint.computeMidpoint(props.snappedPoint);
    const midpointCoord: Coordinate = midpoint === false ? undefined : midpoint;

    this.pathMesh.setEnabled(midpoint !== false);
    this.pathMesh = curveToTube(
      BezierCreater.Create([
        downProps.snappedPoint.coord,
        midpointCoord,
        props.snappedPoint.coord
      ])
        .getLineSegmentChain()
        .getRays()
        .map(x => CoordinateToBabylonVector3(x.setY(1.25).coord)),
      false,
      this.pathMesh
    );
  }

  up() {
    this.fromMesh.setEnabled(false);
    this.toMesh.setEnabled(false);
    this.pathMesh.setEnabled(false);
  }

  cancel() {
    this.fromMesh.setEnabled(false);
    this.toMesh.setEnabled(false);
    this.pathMesh.setEnabled(false);
  }

  wheel(dir: number): void {
    this.dir = dir;
  }
}
