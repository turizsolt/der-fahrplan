import { InputHandler } from '../InputHandler';
import { click } from '../Interfaces/Helpers';
import { Store } from '../../../../structs/Interfaces/Store';
import { CommandLog } from '../../../../structs/Actuals/Store/Command/CommandLog';
import { MeshInfo } from '../../MeshInfo';
import { BaseBrick } from '../../../../structs/Interfaces/BaseBrick';
import { TYPES } from '../../../../di/TYPES';
import { BlockJoint } from '../../../../modules/Signaling/BlockJoint';
import { WhichEnd } from '../../../../structs/Interfaces/WhichEnd';
import { MouseLeft, MouseRight } from '../Interfaces/InputType';
import { PathBlockEnd } from '../../../../modules/Signaling/PathBlockEnd';
import { PathBlock } from '../../../../modules/Signaling/PathBlock';
import { Station } from '../../../../modules/Station/Station';
import { Platform } from '../../../../modules/Station/Platform';

export class PathToStationInputHandler extends InputHandler {
  private commandLog: CommandLog;
  private pathBlocks: PathBlock[] = [];

  constructor(private store: Store) {
    super();

    this.commandLog = store.getCommandLog();

    this.reg(click(MouseLeft), (legacyEvent: PointerEvent) => {
      const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
      const meshInfo = this.getMeshInfo(legacyProps?.mesh?.id);
      if (!meshInfo || !meshInfo.storedBrick) return false;
      if (meshInfo.type !== TYPES.BlockJoint) return false;

      const blockJoint = meshInfo.storedBrick as BlockJoint;
      const end = meshInfo.command === 'jointA' ? WhichEnd.A : WhichEnd.B;
      if (blockJoint.getEnd(end).getType() === TYPES.PathBlockEnd) {
        this.pathBlocks.push((blockJoint.getEnd(end) as PathBlockEnd).getPathBlock());
      }
    });

    this.reg(click(MouseRight), (legacyEvent: PointerEvent) => {
      const legacyProps = this.store.getInputController().convertEventToProps(legacyEvent);
      const meshInfo = this.getMeshInfo(legacyProps?.mesh?.id);
      if (!meshInfo || !meshInfo.storedBrick) return false;
      if (meshInfo.type === TYPES.Station) {
        const station = meshInfo.storedBrick as Station;

        for (let pb of this.pathBlocks) {
          pb.setStation(station);
        }

        this.pathBlocks = [];
      } else if (meshInfo.type === TYPES.Platform) {
        const platform = meshInfo.storedBrick as Platform;
        const station = platform.getStation();
        if (!station) return false;

        for (let pb of this.pathBlocks) {
          pb.setStation(station);
        }

        this.pathBlocks = [];
      } else if (meshInfo.type === TYPES.BlockJoint) {
        const blockJoint = meshInfo.storedBrick as BlockJoint;
        const end = meshInfo.command === 'jointA' ? WhichEnd.A : WhichEnd.B;
        if (blockJoint.getEnd(end).getType() === TYPES.PathBlockEnd) {
          (blockJoint.getEnd(end) as PathBlockEnd).getPathBlock().setStation(null);
        }
      }
    });
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
