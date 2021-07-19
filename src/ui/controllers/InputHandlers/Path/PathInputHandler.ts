import { InputHandler } from '../InputHandler';
import { click } from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { InputProps } from '../../InputProps';
import { CommandLog } from '../../../../structs/Actuals/Store/Command/CommandLog';
import { PathInputHandlerPlugin } from './PathInputHandlerPlugin';
import { PathInputHandlerPixi } from './PathInputHandlerPixi';
import { PathInputHandlerBabylon } from './PathInputHandlerBabylon';
import { MeshInfo } from '../../MeshInfo';
import { BaseBrick } from '../../../../structs/Interfaces/BaseBrick';
import { TYPES } from '../../../../di/TYPES';
import { BlockJoint } from '../../../../modules/Signaling/BlockJoint';
import { WhichEnd } from '../../../../structs/Interfaces/WhichEnd';
import { BlockJointEnd } from '../../../../modules/Signaling/BlockJointEnd';
import { MouseLeft, MouseRight } from '../Interfaces/InputType';
import { PathBlockEnd } from '../../../../modules/Signaling/PathBlockEnd';

// @injectable()
export class PathInputHandler extends InputHandler {
  private commandLog: CommandLog;
  private jointEnds: BlockJointEnd[] = [];

  // @inject(TYPES.TrackInputHandler)
  private plugin: PathInputHandlerPlugin;

  constructor(private store: Store) {
    super();

    this.canPushAJoint = this.canPushAJoint.bind(this);

    // todo inject
    this.plugin =
      globalThis.startParam === '2d'
        ? new PathInputHandlerPixi()
        : new PathInputHandlerBabylon();
    this.plugin.init();
    this.commandLog = store.getCommandLog();

    this.reg(click(MouseLeft), (legacyEvent: PointerEvent) => {
      const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
      if (!this.canPushAJoint(legacyProps)) return false;
    });

    this.reg(click(MouseRight), (legacyEvent: PointerEvent) => {
      const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
      if (!this.canPushAJoint(legacyProps)) return false;

      const pathBlocksEnds = this.jointEnds.map(
        je => je.joint.getEnd(je.end) as PathBlockEnd
      );
      const blockEnd = this.jointEnds[0].joint.getEnd(
        this.jointEnds[0].end
      );
      const pathBlockEnd = blockEnd as PathBlockEnd;
      const pathBlock = pathBlockEnd.getPathBlock();
      pathBlock.addRule({
        filter: '',
        from: pathBlocksEnds[0],
        toOptions: pathBlocksEnds.slice(1)
      });

      this.jointEnds = [];
    });
  }

  private canPushAJoint(legacyProps: InputProps): boolean {
    const meshInfo = this.getMeshInfo(legacyProps?.mesh?.id);
    if (!meshInfo || !meshInfo.storedBrick) return false;
    if (meshInfo.type !== TYPES.BlockJoint) return false;

    const joint = this.store.get(meshInfo.id) as BlockJoint;
    const end = meshInfo.command === 'jointA' ? WhichEnd.A : WhichEnd.B;

    if (joint?.getEnd(end)?.getType() !== TYPES.PathBlockEnd) return false;

    this.jointEnds.push({ joint, end });
    return true;
  }

  // todo duplicate from SelectInputHandler
  private getMeshInfo(meshId: string): MeshInfo {
    if (!meshId) return null;

    if (meshId.includes('.')) {
      meshId = meshId.slice(0, meshId.indexOf('.'));
    }

    if (meshId.startsWith('clickable-')) {
      const [_, type, id, command] = meshId.split('-');
      const storedObj = this.store.get(id);
      const storedBrick = storedObj as BaseBrick;
      return {
        typeString: type, id, command, storedBrick, type: storedBrick?.getType()
      };
    }

    return null;
  }
}
