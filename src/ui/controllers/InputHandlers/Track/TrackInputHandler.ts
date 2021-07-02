import { InputHandler } from '../InputHandler';
import {
  MouseLeft,
  WheelPos,
  WheelNeg
} from '../Interfaces/InputType';
import {
  click,
  drag,
  drop,
  wheel,
  move,
  roam
} from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { InputProps } from '../../InputProps';
import {
  CommandLog,
  GENERATE_ID
} from '../../../../structs/Actuals/Store/Command/CommandLog';
import { CommandCreator } from '../../../../structs/Actuals/Store/Command/CommandCreator';
import { TrackJoint } from '../../../../modules/Track/TrackJoint/TrackJoint';
import { Command } from '../../../../structs/Actuals/Store/Command/Command';
import { TYPES } from '../../../../di/TYPES';
import { Ray } from '../../../../structs/Geometry/Ray';
import { TrackJointConnector } from '../../../../modules/Track/TrackJoint/TrackJointConnector';
import { TrackInputHandlerPlugin } from './TrackInputHandlerPlugin';
import { TrackInputHandlerPixi } from './TrackInputHandlerPixi';
import { TrackInputHandlerBabylon } from './TrackInputHandlerBabylon';
import { InputMod } from '../Interfaces/InputMod';

// @injectable()
export class TrackInputHandler extends InputHandler {
  private commandLog: CommandLog;
  private wheelRad: number = 0;
  private downWheelRad: number = 0;

  // @inject(TYPES.TrackInputHandler) 
  private plugin:TrackInputHandlerPlugin;
  private isRoam:boolean = true;
  private props: InputProps;
  private downProps: InputProps;

  constructor(private store: Store) {
    super();

    // todo inject
    this.plugin = globalThis.startParam === '2d' ? new TrackInputHandlerPixi() : new TrackInputHandlerBabylon();
    this.plugin.init();
    this.commandLog = store.getCommandLog();

    this.reg(wheel(WheelPos, InputMod.None), () => {
      this.wheelRad -= Math.PI / 6;
      this.plugin.wheel(this.wheelRad);
      if(this.isRoam) {
        this.plugin.roam(this.props);
      } else {
        this.move(this.props);
      }
    });

    this.reg(wheel(WheelNeg, InputMod.None), () => {
      this.wheelRad += Math.PI / 6;
      this.plugin.wheel(this.wheelRad);
      if(this.isRoam) {
        this.plugin.roam(this.props);
      } else {
        this.move(this.props);
      }
    });

    this.reg(move(MouseLeft), (legacyProp: InputProps) => {
      this.move(legacyProp);
      this.props = legacyProp;
    });

    this.reg(roam(), (legacyProp: InputProps) => {
      this.plugin.roam(legacyProp);

      this.props = legacyProp;
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

    this.reg(drag(MouseLeft), (legacyProp: InputProps) => {
        this.downWheelRad = this.wheelRad;
        this.plugin.down(legacyProp);
        this.isRoam = false;

        this.downProps = legacyProp.downProps;
        this.props = legacyProp;
    });

    this.reg(drop(MouseLeft), (legacyProp: InputProps) => {
        const props = legacyProp;
        const downProps = legacyProp.downProps;
        this.isRoam = true;

        this.downProps = null;
        this.props = legacyProp;
    
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
      this.plugin.up(legacyProp.downProps, legacyProp);    
      return true;
      
    });
  }

  move(legacyProp: InputProps): void {
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
    
    this.plugin.move(downProps, props);
  }
}
