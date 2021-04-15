import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BlockSegmentData } from './BlockSegmentData';
import { Train } from '../Train/Train';

export interface Block extends BaseBrick {
  init(segmentData: BlockSegmentData): Block;
  checkin(train: Train): void;
  checkout(train: Train): void;
  isFree(): boolean;
}
