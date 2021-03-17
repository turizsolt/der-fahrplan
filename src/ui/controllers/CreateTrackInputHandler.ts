import * as BABYLON from 'babylonjs';
import { InputHandler } from './InputHandler';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { InputProps } from './InputProps';
import { TrackJoint } from '../../structs/Interfaces/TrackJoint';
import { curveToTube } from '../../ui/babylon/TrackBabylonRenderer';
import { BezierCreater } from '../../structs/Geometry/Bezier/BezierCreater';
import { CoordinateToBabylonVector3 } from '../../ui/babylon/converters/CoordinateToBabylonVector3';
import { Store } from '../../structs/Interfaces/Store';
import { CommandLog, GENERATE_ID } from '../../structs/Actuals/Store/Command/CommandLog';
import { CommandCreator } from '../../structs/Actuals/Store/Command/CommandCreator';
import { Command } from '../../structs/Actuals/Store/Command/Command';
import { TYPES } from '../../di/TYPES';

export class CreateTrackInputHandler implements InputHandler {
  private fromMesh: BABYLON.Mesh;
  private toMesh: BABYLON.Mesh;
  private pathMesh: BABYLON.Mesh;
  private commandLog: CommandLog;

  constructor(private store: Store) {
    this.commandLog = store.getCommandLog();

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

  down(props: InputProps, event: PointerEvent): void {
    if (!props.snappedJoint) {
      this.fromMesh.setEnabled(
        !props.snappedJoint && !props.snappedPositionOnTrack
      );
      this.fromMesh.position = CoordinateToBabylonVector3(
        props.snappedPoint.coord
      );
      this.fromMesh.position.y = 0.75;
      this.fromMesh.rotation.y = props.wheelRad;
    }

    this.toMesh.setEnabled(
      !props.snappedJoint && !props.snappedPositionOnTrack
    );
    this.toMesh.position = CoordinateToBabylonVector3(props.snappedPoint.coord);
    this.toMesh.position.y = 0.75;
    this.toMesh.rotation.y = props.wheelRad;

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

  roam(props: InputProps, event: PointerEvent): void {
    if (props.snappedPoint) {
      this.fromMesh.position = CoordinateToBabylonVector3(
        props.snappedPoint.coord
      );
      this.fromMesh.position.y = 0.75;
    }
    this.fromMesh.rotation.y = props.wheelRad;
    this.fromMesh.setEnabled(
      !props.snappedJoint && !props.snappedPositionOnTrack
    );
  }

  move(downProps: InputProps, props: InputProps, event: PointerEvent): void {
    this.toMesh.position = CoordinateToBabylonVector3(props.snappedPoint.coord);
    this.toMesh.position.y = 0.75;
    this.toMesh.rotation.y = props.wheelRad;
    this.toMesh.setEnabled(!props.snappedJoint);

    if (props.snappedJoint) {
      props.snappedPoint.dirXZ = props.snappedJoint.getRotation();
    }

    if (downProps.snappedJoint) {
      downProps.snappedPoint.dirXZ = downProps.snappedJoint.getRotation();
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
        .getLineSegmentChain()
        .getRays()
        .map(x => CoordinateToBabylonVector3(x.setY(1.25).coord)),
      false,
      this.pathMesh
    );
  }

  click(downProps: InputProps, event: PointerEvent): void {
    if (!downProps.snappedJoint && !downProps.snappedPositionOnTrack) {
      const tj = this.commandLog.addAction(CommandCreator.createTrackJoint(
        GENERATE_ID,
        downProps.snappedPoint.coord.x,
        downProps.snappedPoint.coord.z,
        downProps.wheelRad
      ));
    }
  }

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
      let j1, j2: TrackJoint;
      let s1: boolean = false;
      let s2: boolean = false;
      const deletable: TrackJoint[] = [];
      const actions: Command[] = [];
      if (downProps.snappedJoint) {
        j1 = downProps.snappedJoint;
      } else {
        s1 = true;
        j1 = this.store.create<TrackJoint>(TYPES.TrackJoint).init(
          downProps.snappedPoint.coord.x,
          downProps.snappedPoint.coord.z,
          downProps.wheelRad
        );
        actions.push(CommandCreator.createTrackJoint(
          GENERATE_ID,
          downProps.snappedPoint.coord.x,
          downProps.snappedPoint.coord.z,
          downProps.wheelRad
        ));
        deletable.push(j1);
      }

      if (props.snappedJoint) {
        j2 = props.snappedJoint;
      } else {
        s2 = true;
        j2 = this.store.create<TrackJoint>(TYPES.TrackJoint).init(
          props.snappedPoint.coord.x,
          props.snappedPoint.coord.z,
          props.wheelRad
        );
        actions.push(CommandCreator.createTrackJoint(
          GENERATE_ID,
          props.snappedPoint.coord.x,
          props.snappedPoint.coord.z,
          props.wheelRad
        ));
        deletable.push(j2);
      }

      const ret = j1.connect(j2);

      const replacementIds = deletable.map(j => j.getId());

      deletable.map(j => j.remove());

      if (ret) {
        const actionIds = actions.map(a => this.commandLog.addAction(a));
        const idMapping = replacementIds.reduce(function (result, field, index) {
          result[field] = actionIds[index].returnValue.getId();
          return result;
        }, {});

        ret.map(a => {
          const b = { ...a };

          if (b.function === 'joinTrackJoints') {
            b.params[2] = idMapping[b.params[2]] ?? b.params[2];
            b.params[4] = idMapping[b.params[4]] ?? b.params[4];
          }

          if (b.function === 'joinTrackJoints3') {
            b.params[3] = idMapping[b.params[3]] ?? b.params[3];
            b.params[5] = idMapping[b.params[5]] ?? b.params[5];
            b.params[7] = idMapping[b.params[7]] ?? b.params[7];
          }

          this.commandLog.addAction(b)
        });
      }
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
