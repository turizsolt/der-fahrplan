import { InputHandler } from '../InputHandler';
import { click, roam } from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { InputProps } from '../../InputProps';
import { CommandLog } from '../../../../structs/Actuals/Store/Command/CommandLog';
import { BlockJointInputHandlerPlugin } from './BlockJointInputHandlerPlugin';
import { BlockJointInputHandlerPixi } from './BlockJointInputHandlerPixi';
import { BlockJointInputHandlerBabylon } from './BlockJointInputHandlerBabylon';
import { ActualTrack } from '../../../../modules/Track/ActualTrack';
import { PositionOnTrack } from '../../../../modules/Train/PositionOnTrack';
import { TrackDirection } from '../../../../modules/Track/TrackDirection';
import { BlockJoint } from '../../../../modules/Signaling/BlockJoint';
import { TYPES } from '../../../../di/TYPES';

// @injectable()
export class BlockJointInputHandler extends InputHandler {
  private commandLog: CommandLog;

  // @inject(TYPES.TrackInputHandler)
  private plugin: BlockJointInputHandlerPlugin;

  constructor(private store: Store) {
    super();

    // todo inject
    this.plugin =
      globalThis.startParam === '2d'
        ? new BlockJointInputHandlerPixi()
        : new BlockJointInputHandlerBabylon();
    this.plugin.init();
    this.commandLog = store.getCommandLog();

    this.reg(click(), (legacyProps: InputProps) => {
      const dpot = legacyProps.snappedPositionOnTrack;

      if (dpot && dpot.track.constructor.name === ActualTrack.name) {
        const position = PositionOnTrack.fromTrack(
          dpot.track,
          dpot.track.getLength() * dpot.position,
          TrackDirection.AB
        );
        const opposition = position.opposition();
        const blockJoint = this.store
          .create<BlockJoint>(TYPES.BlockJoint)
          .init(position);
      }

      this.plugin.click();
    });

    this.reg(roam(), (legacyProps: InputProps) => {
      const pot = legacyProps.snappedPositionOnTrack;
      if (pot && pot.track.constructor.name === ActualTrack.name) {
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
}
