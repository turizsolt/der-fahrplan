import { InputHandler } from '../InputHandler';
import { click, roam } from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { InputProps } from '../../InputProps';
import { CommandLog } from '../../../../structs/Actuals/Store/Command/CommandLog';
import { BlockWizardInputHandlerPlugin } from './BlockWizardInputHandlerPlugin';
import { BlockWizardInputHandlerPixi } from './BlockWizardInputHandlerPixi';
import { BlockWizardInputHandlerBabylon } from './BlockWizardInputHandlerBabylon';
import { ActualTrack } from '../../../../modules/Track/ActualTrack';
import { PositionOnTrack } from '../../../../modules/Train/PositionOnTrack';
import { TrackDirection } from '../../../../modules/Track/TrackDirection';
import { ActualTrackSwitch } from '../../../../modules/Track/ActualTrackSwitch';
import { Nearest } from '../../../../modules/Train/Nearest';
import { WhichEnd } from '../../../../structs/Interfaces/WhichEnd';
import { BlockJoint } from '../../../../modules/Signaling/BlockJoint';
import { TYPES } from '../../../../di/TYPES';
import { Signal } from '../../../../modules/Signaling/Signal';
import { Block } from '../../../../modules/Signaling/Block';
import { Section } from '../../../../modules/Signaling/Section';
import { BlockJointEnd } from '../../../../modules/Signaling/BlockJointEnd';

// @injectable()
export class BlockWizardInputHandler extends InputHandler {
  private commandLog: CommandLog;

  // @inject(TYPES.TrackInputHandler)
  private plugin: BlockWizardInputHandlerPlugin;

  constructor(private store: Store) {
    super();

    // todo inject
    this.plugin =
      globalThis.startParam === '2d'
        ? new BlockWizardInputHandlerPixi()
        : new BlockWizardInputHandlerBabylon();
    this.plugin.init();
    this.commandLog = store.getCommandLog();

    this.reg(click(), (legacyProps: InputProps) => {
      const dpot = legacyProps.snappedPositionOnTrack;
      const position =
        dpot &&
        PositionOnTrack.fromTrack(
          dpot.track,
          dpot.track.getLength() * dpot.position,
          TrackDirection.AB
        );

      if (dpot && dpot.track.constructor.name === ActualTrack.name) {
        this.wizardBlock(position);
      } else if (
        dpot &&
        dpot.track.constructor.name === ActualTrackSwitch.name
      ) {
        this.wizardPathBlock(position);
      }

      this.plugin.click();
    });

    this.reg(roam(), (legacyProps: InputProps) => {
      const pot = legacyProps.snappedPositionOnTrack;
      if (
        pot &&
        (pot.track.constructor.name === ActualTrack.name ||
          pot.track.constructor.name === ActualTrackSwitch.name)
      ) {
        const point = pot.track
          .getCurve()
          .getBezier()
          .getPoint(pot.position);

        this.plugin.roam(!!pot, point);
      } else {
        this.plugin.roam(false);
      }
    });
  }

  wizardBlock(position: PositionOnTrack): void {
    const opposition = position.opposition();
    console.log('wizard block');

    const nearestForward = Nearest.blockJoint(position);
    const nearestBackward = Nearest.blockJoint(opposition);
    const nearestEndForward = Nearest.singleEnd(position);
    const nearestEndBackward = Nearest.singleEnd(opposition);

    if (nearestEndForward.distance < nearestForward.distance) {
      nearestEndForward.blockJoint = this.store
        .create<BlockJoint>(TYPES.BlockJoint)
        .init(nearestEndForward.position);
    }

    const forward =
      nearestEndForward.distance < nearestForward.distance
        ? nearestEndForward
        : nearestForward;

    if (nearestEndBackward.distance < nearestBackward.distance) {
      nearestEndBackward.blockJoint = this.store
        .create<BlockJoint>(TYPES.BlockJoint)
        .init(nearestEndBackward.position);
    }

    const backward =
      nearestEndBackward.distance < nearestBackward.distance
        ? nearestEndBackward
        : nearestBackward;

    const wholeDistance = forward.distance + backward.distance;
    const signalMinimumDistance = 40;
    const signalCount = Math.max(
      1,
      Math.floor(wholeDistance / signalMinimumDistance)
    );
    const signalPlantingDistance = wholeDistance / signalCount;

    console.log(wholeDistance, signalCount, signalPlantingDistance);

    const pos = backward.position.opposition();
    const joints = [] as BlockJointEnd[];
    let i = 0;
    joints.push({
      joint: backward.blockJoint,
      end: convertFrom(backward.blockJoint, backward.position.opposition())
    });

    for (i = 1; i < signalCount; i++) {
      pos.move(signalPlantingDistance);
      const joint = this.store
        .create<BlockJoint>(TYPES.BlockJoint)
        .init(pos.clone());
      joints.push({ joint, end: WhichEnd.A });
      joints.push({ joint, end: WhichEnd.B });
    }
    joints.push({
      joint: forward.blockJoint,
      end: convertTo(forward.blockJoint, forward.position)
    });

    const blocks = [] as Block[];
    for (i = 0; i < joints.length; i += 2) {
      const block = this.store.create<Block>(TYPES.Block).init({
        startJointEnd: joints[i],
        endJointEnd: joints[i + 1]
      });
      blocks.push(block);
      block.getSegment().connect();
    }

    const section = this.store
      .create<Section>(TYPES.Section)
      .init(joints[0], joints[joints.length - 1]);
    section.connect();
  }

  wizardPathBlock(position: PositionOnTrack): void {
    console.error('wizard path');
  }
}

function convertFrom(bj: BlockJoint, pos: PositionOnTrack): WhichEnd {
  const tdbj = bj
    .getPosition()
    .getDirectedTrack()
    .getDirection();
  const tdpos = pos.getDirectedTrack().getDirection();

  if (tdbj === tdpos) {
    return WhichEnd.B;
  } else {
    return WhichEnd.A;
  }
}

function convertTo(bj: BlockJoint, pos: PositionOnTrack): WhichEnd {
  const tdbj = bj
    .getPosition()
    .getDirectedTrack()
    .getDirection();
  const tdpos = pos.getDirectedTrack().getDirection();

  if (tdbj === tdpos) {
    return WhichEnd.A;
  } else {
    return WhichEnd.B;
  }
}
