import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { Coordinate } from '../structs/Geometry/Coordinate';
import { InputProps } from './InputProps';
import { babylonContainer } from '../structs/inversify.config';
import { TrackJoint } from '../structs/TrackJoint/TrackJoint';
import { TYPES } from '../structs/TYPES';
import { curveToTube } from '../structs/Track/TrackBabylonRenderer';
import { BezierCreater } from '../structs/Geometry/Bezier/BezierCreater';
import { CoordinateToBabylonVector3 } from '../structs/CoordinateToBabylonVector3';

export class CreateTrackInputHandler implements InputHandler {
  private fromMesh: BABYLON.Mesh;
  private toMesh: BABYLON.Mesh;
  private pathMesh: BABYLON.Mesh;

  constructor() {
    const mat = new BABYLON.StandardMaterial('arrow', null);
    mat.diffuseTexture = new BABYLON.Texture('assets/arrow.png', null);

    this.fromMesh = BABYLON.MeshBuilder.CreateCylinder(
      'placeholder-1',
      {
        diameter: 3,
        tessellation: 24,
        height: 1,
        faceUV: [
          new BABYLON.Vector4(0, 0, 1, 1),
          new BABYLON.Vector4(1, 1, 1, 1)
        ],
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
        height: 1,
        faceUV: [
          new BABYLON.Vector4(0, 0, 1, 1),
          new BABYLON.Vector4(1, 1, 1, 1)
        ],
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
    if (!props.snappedJoint) {
      this.fromMesh.setEnabled(
        !props.snappedJoint && !props.snappedPositionOnTrack
      );
      this.fromMesh.position = CoordinateToBabylonVector3(
        props.snappedPoint.coord
      );
      this.fromMesh.rotation.y = props.wheelRad;
    }

    this.toMesh.setEnabled(
      !props.snappedJoint && !props.snappedPositionOnTrack
    );
    this.toMesh.position = CoordinateToBabylonVector3(props.snappedPoint.coord);
    this.toMesh.rotation.y = props.wheelRad;

    this.pathMesh = curveToTube(
      BezierCreater.Create([props.snappedPoint.coord, props.snappedPoint.coord])
        .getLinePoints()
        .map(CoordinateToBabylonVector3),
      false,
      this.pathMesh
    );
    this.pathMesh.setEnabled(!props.snappedJoint);
  }

  roam(props: InputProps, event: PointerEvent): void {
    if (props.snappedPoint) {
      this.fromMesh.position = CoordinateToBabylonVector3(
        props.snappedPoint.coord
      );
    }
    this.fromMesh.rotation.y = props.wheelRad;
    this.fromMesh.setEnabled(
      !props.snappedJoint && !props.snappedPositionOnTrack
    );
  }

  move(downProps: InputProps, props: InputProps, event: PointerEvent): void {
    this.toMesh.position = CoordinateToBabylonVector3(props.snappedPoint.coord);
    this.toMesh.rotation.y = props.wheelRad;
    this.toMesh.setEnabled(!props.snappedJoint);

    if (props.snappedJoint) {
      props.snappedPoint.dirXZ = props.snappedJoint.getRotation();
    }

    const midpoint = downProps.snappedPoint.computeMidpoint(props.snappedPoint);
    const midpointCoord: Coordinate = midpoint === false ? undefined : midpoint;

    this.pathMesh.setEnabled(midpoint !== false);
    this.pathMesh = curveToTube(
      BezierCreater.Create([
        downProps.snappedPoint.coord,
        midpointCoord,
        props.snappedPoint.coord
      ])
        .getLinePoints()
        .map(CoordinateToBabylonVector3),
      false,
      this.pathMesh
    );
  }

  click(downProps: InputProps, event: PointerEvent): void {
    if (!downProps.snappedJoint) {
      const tj = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
      tj.init(
        downProps.snappedPoint.coord.x,
        downProps.snappedPoint.coord.z,
        downProps.wheelRad
      );
    }
  }

  up(downProps: InputProps, props: InputProps, event: PointerEvent): void {
    let j1, j2;
    let deletable: TrackJoint[] = [];
    if (downProps.snappedJoint) {
      j1 = downProps.snappedJoint;
    } else {
      j1 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
      j1.init(
        downProps.snappedPoint.coord.x,
        downProps.snappedPoint.coord.z,
        downProps.wheelRad
      );
      deletable.push(j1);
    }

    if (props.snappedJoint) {
      j2 = props.snappedJoint;
    } else {
      j2 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
      j2.init(
        props.snappedPoint.coord.x,
        props.snappedPoint.coord.z,
        props.wheelRad
      );
      deletable.push(j2);
    }

    const ret = j2.connect(j1);
    if (!ret) {
      deletable.map(j => j.remove());
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
