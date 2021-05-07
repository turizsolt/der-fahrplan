import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BlockJointEnd } from './BlockJointEnd';
import { TrackDirection } from '../Track/TrackDirection';

export interface Section extends BaseBrick {
  init(
    startBlockJointEnd: BlockJointEnd,
    endBlockJointEnd: BlockJointEnd
  ): Section;
  isFree(direction: TrackDirection): boolean;
  getDirection(): TrackDirection;
}
