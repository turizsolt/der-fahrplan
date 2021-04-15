import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BlockSegmentData } from './BlockSegmentData';
import { Train } from '../Train/Train';
import { Emitable } from '../../mixins/Emitable';

export interface Block extends BaseBrick, Emitable {
  init(segmentData: BlockSegmentData): Block;
  checkin(train: Train): void;
  checkout(train: Train): void;
  isFree(): boolean;
}
