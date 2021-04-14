import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BlockSegmentData } from './BlockSegmentData';

export interface Block extends BaseBrick {
  init(segmentData: BlockSegmentData): Block;
}
