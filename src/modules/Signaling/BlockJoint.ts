import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BlockEnd } from './BlockEnd';

export interface BlockJoint extends BaseBrick {
  init(position: PositionOnTrack): BlockJoint;
  setOneEnd(jointEnd: WhichEnd, blockEnd: BlockEnd): void;
  removeEnd(blockEnd: BlockEnd): void;
  getEnd(whichEnd: WhichEnd): BlockEnd;
  getPosition(): PositionOnTrack;
}
