import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BlockJointEnd } from './BlockJointEnd';
import { PathBlockEnd } from './PathBlockEnd';

export interface PathBlock extends BaseBrick {
  init(jointEnds: BlockJointEnd[]): PathBlock;
  allow(startPBE: PathBlockEnd, endPBE: PathBlockEnd, count?: number): void;
  checkout(endPathBlockEnd: PathBlockEnd): void;
}
