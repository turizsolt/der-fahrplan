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

export class NewTrackInputHandler extends NewInputHandler {
  private commandLog: CommandLog;
  private wheelRad: number = Math.PI / 2;

  constructor(private store: Store) {
    super();

    this.commandLog = store.getCommandLog();

    const point = new PIXI.Graphics();
    point.beginFill(0xff0000); //0x0bef47);
    point.drawRect(-0.5, -1.5, 1, 3);
    point.endFill();
    point.rotation = -this.wheelRad;
    globalThis.stage.addChild(point);

    // todo copy from old
    // todo put BAB/PIX dependecies into a separate class

    this.reg(wheel(WheelPos), () => {
      this.wheelRad -= Math.PI / 3;
      point.rotation = -this.wheelRad;
    });

    this.reg(wheel(WheelNeg), () => {
      this.wheelRad += Math.PI / 3;
      point.rotation = -this.wheelRad;
    });

    this.reg(move(), (legacyProp: InputProps) => {
      console.log('move');
      const ray = snapHexaXZ(legacyProp.point);
      point.x = ray.coord.x;
      point.y = ray.coord.z;
    });

    this.reg(roam(), (legacyProp: InputProps) => {
      console.log('roam');
      const ray = snapHexaXZ(legacyProp.point);
      point.x = ray.coord.x;
      point.y = ray.coord.z;
    });

    this.reg(click(MouseLeft), (legacyProp: InputProps) => {
      console.log('track click');
      if (!legacyProp.snappedJoint && !legacyProp.snappedPositionOnTrack) {
        console.log('created track command');
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
      console.log('not created');
      return false;
    });

    this.reg(drop(MouseLeft), (legacyProp: InputProps) => {
      /*
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
                Ray.from(
                  downProps.snappedPoint.coord.x,
                  0,
                  downProps.snappedPoint.coord.z,
                  downProps.wheelRad
                ));
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
                Ray.from(
                  props.snappedPoint.coord.x,
                  0,
                  props.snappedPoint.coord.z,
                  props.wheelRad
                ));
              actions.push(CommandCreator.createTrackJoint(
                GENERATE_ID,
                props.snappedPoint.coord.x,
                props.snappedPoint.coord.z,
                props.wheelRad
              ));
              deletable.push(j2);
            }
      
            const ret = TrackJointConnector.connect(j1, j2);
      
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
                  b.params[9] = idMapping[b.params[9]] ?? b.params[9];
                }
      
                this.commandLog.addAction(b)
              });
            }
          }
          
      return true;
      */
    });
  }
}
