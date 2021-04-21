import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BlockJointEnd } from './BlockJointEnd';

export interface PathBlock extends BaseBrick {
  init(jointEnds: BlockJointEnd[]): PathBlock;
}
