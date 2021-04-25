import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BlockSegmentData } from './BlockSegmentData';
import { Train } from '../Train/Train';
import { Emitable } from '../../mixins/Emitable';
import { BlockSegment } from './BlockSegment';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BlockEnd } from './BlockEnd';

export interface Block extends BaseBrick, Emitable {
  init(segmentData: BlockSegmentData): Block;
  checkin(train: Train): void;
  checkout(train: Train): void;
  isFree(): boolean;
  getSegment(): BlockSegment;
  getEnd(whichEnd: WhichEnd): BlockEnd;
}
