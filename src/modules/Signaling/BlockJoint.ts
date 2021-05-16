import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BlockEnd } from './BlockEnd';
import { SectionEnd } from './SectionEnd';

export interface BlockJoint extends BaseBrick {
  init(position: PositionOnTrack): BlockJoint;
  setOneEnd(jointEnd: WhichEnd, blockEnd: BlockEnd): void;
  removeEnd(blockEnd: BlockEnd): void;
  setOneSectionEnd(jointEnd: WhichEnd, sectionEnd: SectionEnd): void;
  removeSectionEnd(sectionEnd: SectionEnd): void;
  getEnd(whichEnd: WhichEnd): BlockEnd;
  getSectionEnd(whichEnd: WhichEnd): SectionEnd;
  getPosition(): PositionOnTrack;
}
