import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BlockJointEnd } from './BlockJointEnd';
import { PathBlockEnd } from './PathBlockEnd';
import { Train } from '../Train/Train';

export interface PathBlock extends BaseBrick {
  init(jointEnds: BlockJointEnd[]): PathBlock;
  allow(startPBE: PathBlockEnd, endPBE: PathBlockEnd, count?: number): void;
  checkout(endPathBlockEnd: PathBlockEnd): void;
  requestPath(pathBlockEnd: PathBlockEnd, train: Train): void;
}
