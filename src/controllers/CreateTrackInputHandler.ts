import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { Coordinate } from '../structs/Geometry/Coordinate';
import { Ray } from '../structs/Geometry/Ray';
import { InputProps } from './InputProps';
import { babylonContainer } from '../structs/inversify.config';
import { TrackJoint } from '../structs/TrackJoint/TrackJoint';
import { TYPES } from '../structs/TYPES';
import { curveToTube } from '../structs/Track/TrackBabylonRenderer';
import { BezierCreater } from '../structs/Geometry/Bezier/BezierCreater';
import { CoordinateToBabylonVector3 } from '../structs/CoordinateToBabylonVector3';

export class CreateTrackInputHandler implements InputHandler {
  private downProps: InputProps;

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

  down(props: InputProps) {
    //console.log('dn', props);
    this.downProps = props;

    if (!props.snappedJoint) {
      this.fromMesh.setEnabled(true);
      this.fromMesh.position = CoordinateToBabylonVector3(
        props.snappedPoint.coord
      );
      this.fromMesh.rotation.y = props.wheelRad;
    }

    this.toMesh.setEnabled(true);
    this.toMesh.position = CoordinateToBabylonVector3(props.snappedPoint.coord);
    this.toMesh.rotation.y = props.wheelRad;

    this.pathMesh = curveToTube(
      BezierCreater.Create([props.snappedPoint.coord, props.snappedPoint.coord])
        .getLinePoints()
        .map(CoordinateToBabylonVector3),
      false,
      this.pathMesh
    );
    this.pathMesh.setEnabled(true);
  }

  move(props: InputProps) {
    if (!this.downProps) {
      this.fromMesh.position = CoordinateToBabylonVector3(
        props.snappedPoint.coord
      );
      this.fromMesh.rotation.y = props.wheelRad;
      this.fromMesh.setEnabled(!props.snappedJoint);
    } else {
      this.toMesh.position = CoordinateToBabylonVector3(
        props.snappedPoint.coord
      );
      this.toMesh.rotation.y = props.wheelRad;
      this.toMesh.setEnabled(!props.snappedJoint);

      if (props.snappedJoint) {
        props.snappedPoint.dirXZ = props.snappedJoint.getRotation();
      }

      const midpoint = this.downProps.snappedPoint.computeMidpoint(
        props.snappedPoint
      );
      const midpointCoord: Coordinate =
        midpoint === false ? undefined : midpoint;

      this.pathMesh.setEnabled(midpoint !== false);
      this.pathMesh = curveToTube(
        BezierCreater.Create([
          this.downProps.snappedPoint.coord,
          midpointCoord,
          props.snappedPoint.coord
        ])
          .getLinePoints()
          .map(CoordinateToBabylonVector3),
        false,
        this.pathMesh
      );
    }
  }

  up(props: InputProps) {
    if (this.downProps.point.coord.equalsTo(props.point.coord)) {
      console.log('click');

      if (!this.downProps.snappedJoint) {
        const tj = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
        tj.init(
          this.downProps.snappedPoint.coord.x,
          this.downProps.snappedPoint.coord.z,
          this.downProps.wheelRad
        );
      }
    } else {
      console.log('moved and up');

      let j1, j2;
      if (this.downProps.snappedJoint) {
        j1 = this.downProps.snappedJoint;
      } else {
        j1 = babylonContainer.get<TrackJoint>(TYPES.TrackJoint);
        j1.init(
          this.downProps.snappedPoint.coord.x,
          this.downProps.snappedPoint.coord.z,
          this.downProps.wheelRad
        );
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
      }

      j2.connect(j1);
    }

    this.fromMesh.setEnabled(false);
    this.toMesh.setEnabled(false);
    this.pathMesh.setEnabled(false);

    this.downProps = null;
  }
}
