import * as PIXI from 'pixi.js';
import { NewInputHandler } from './NewInputHandler';
import {
  MouseLeft,
  MouseRight,
  WheelPos,
  WheelNeg
} from './Interfaces/InputType';
import {
  keyUp,
  click,
  drag,
  drop,
  wheel,
  move,
  roam
} from './Interfaces/Helpers';
import { Store } from '../../../structs/Interfaces/Store';
import { InputProps } from '../InputProps';
import {
  CommandLog,
  GENERATE_ID
} from '../../../structs/Actuals/Store/Command/CommandLog';
import { CommandCreator } from '../../../structs/Actuals/Store/Command/CommandCreator';
import { snapHexaXZ } from '../../../structs/Geometry/Snap';
import { TrackJoint } from '../../../modules/Track/TrackJoint/TrackJoint';
import { Command } from '../../../structs/Actuals/Store/Command/Command';
import { TYPES } from '../../../di/TYPES';
import { Ray } from '../../../structs/Geometry/Ray';
import { TrackJointConnector } from '../../../modules/Track/TrackJoint/TrackJointConnector';
import { Coordinate } from '../../../structs/Geometry/Coordinate';
import { BezierCreater } from '../../../structs/Geometry/Bezier/BezierCreater';
import { Left, Right } from '../../../structs/Geometry/Directions';

export class NewTrackInputHandler extends NewInputHandler {
  private commandLog: CommandLog;
  private wheelRad: number = Math.PI / 2;
  private downWheelRad: number = Math.PI / 2;
  private line: PIXI.Graphics;

  constructor(private store: Store) {
    super();

    this.commandLog = store.getCommandLog();

    /* todo remove to separate file
    const point = new PIXI.Graphics();
    point.beginFill(0xff0000); //0x0bef47);
    point.drawRect(-0.5, -1.5, 1, 3);
    point.endFill();
    point.rotation = -this.wheelRad;
    globalThis.stage.addChild(point);

    let line = new PIXI.Graphics();
    line.lineStyle(1, 0x0000FF, 1);
    globalThis.stage.addChild(line);
    */

    // todo copy from old
    // todo put BAB/PIX dependecies into a separate class

    this.reg(wheel(WheelPos), () => {
      this.wheelRad -= Math.PI / 6;
      // todo point.rotation = -this.wheelRad;
    });

    this.reg(wheel(WheelNeg), () => {
      this.wheelRad += Math.PI / 6;
      // todo point.rotation = -this.wheelRad;
    });

    this.reg(move(), (legacyProp: InputProps) => {
      const ray = snapHexaXZ(legacyProp.point);
      // todo point.x = ray.coord.x;
      // todo point.y = ray.coord.z;

      const props = legacyProp;
      const downProps = legacyProp.downProps;
      props.snappedPoint.dirXZ = this.wheelRad;
      downProps.snappedPoint.dirXZ = this.downWheelRad;
      if(props.snappedJoint) {
        props.snappedPoint.dirXZ = props.snappedJoint.getRotation();
      }
      if(downProps.snappedJoint) {
        downProps.snappedPoint.dirXZ = downProps.snappedJoint.getRotation();
      }
      const midpoint = downProps.snappedPoint.computeMidpoint(props.snappedPoint);
      const midpointCoord: Coordinate = midpoint === false ? undefined : midpoint;
      const chain = BezierCreater.Create([
        downProps.snappedPoint.coord,
        midpointCoord,
        props.snappedPoint.coord
      ])
        .getLineSegmentChain();
    
        /* todo
        const rays1 = chain.getRays().map(r => r.fromHere(Left, 0.25));
        const rays2 = chain
          .getRays()
          .map(r => r.fromHere(Right, 0.25))
          .reverse();
    
        const coords = rays1.map(r => new PIXI.Point(r.coord.x, r.coord.z));
        coords.push(...rays2.map(r => new PIXI.Point(r.coord.x, r.coord.z)));
        const polygon = new PIXI.Polygon(coords);
    
        line.clear();
        line.hitArea = polygon;
        line.beginFill(0x0000ff);
        line.drawPolygon(polygon);
        line.endFill();
        line.zIndex = 2; */
    });

    this.reg(roam(), (legacyProp: InputProps) => {
      /* todo
      const ray = snapHexaXZ(legacyProp.point);
      point.x = ray.coord.x;
      point.y = ray.coord.z;
      line.clear();
      */
    });

    this.reg(click(MouseLeft), (legacyProp: InputProps) => {
      if (!legacyProp.snappedJoint && !legacyProp.snappedPositionOnTrack) {
        this.commandLog.addAction(
          CommandCreator.createTrackJoint(
            GENERATE_ID,
            legacyProp.snappedPoint.coord.x,
            legacyProp.snappedPoint.coord.z,
            this.wheelRad
          )
        );
        return true;
      }
      return false;
    });

    this.reg(drag(MouseLeft), () => {
        this.downWheelRad = this.wheelRad;
    });

    this.reg(drop(MouseLeft), (legacyProp: InputProps) => {
        const props = legacyProp;
        const downProps = legacyProp.downProps;
    
        // only if the point is not on a track, except the two ends
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
            const deletable: TrackJoint[] = [];
            const actions: Command[] = [];

            // if there is a joint to snap, then do not create a new
            if (downProps.snappedJoint) {
              j1 = downProps.snappedJoint;
            } else {
              j1 = this.store.create<TrackJoint>(TYPES.TrackJoint).init(
                Ray.from(
                  downProps.snappedPoint.coord.x,
                  0,
                  downProps.snappedPoint.coord.z,
                  this.downWheelRad
                ));
              actions.push(CommandCreator.createTrackJoint(
                GENERATE_ID,
                downProps.snappedPoint.coord.x,
                downProps.snappedPoint.coord.z,
                this.downWheelRad
              ));
              deletable.push(j1);
            }
      
            if (props.snappedJoint) {
              j2 = props.snappedJoint;
            } else {
              j2 = this.store.create<TrackJoint>(TYPES.TrackJoint).init(
                Ray.from(
                  props.snappedPoint.coord.x,
                  0,
                  props.snappedPoint.coord.z,
                  this.wheelRad
                ));
              actions.push(CommandCreator.createTrackJoint(
                GENERATE_ID,
                props.snappedPoint.coord.x,
                props.snappedPoint.coord.z,
                this.wheelRad
              ));
              deletable.push(j2);
            }
      
            const ret = TrackJointConnector.connect(j1, j2);
      
            const replacementIds = deletable.map(j => j.getId());
      
            // if created, we should delete, so we can create it again officially
            // then we need to map the id-s in the command, and replace them ??? 
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
                  b.params[9] = idMapping[b.params[9]] ?? b.params[9];
                }
      
                this.commandLog.addAction(b)
              });
            }
          }
          
      return true;
      
    });
  }
}
