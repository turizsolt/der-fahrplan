import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BlockJointEnd } from './BlockJointEnd';
import { PathBlockEnd } from './PathBlockEnd';
import { Train } from '../Train/Train';
import { PathRule } from './PathRule';
import { Coordinate } from '../../structs/Geometry/Coordinate';

export interface PathBlock extends BaseBrick {
  init(jointEnds: BlockJointEnd[]): PathBlock;
  allow(
    startPBE: PathBlockEnd,
    endPBE: PathBlockEnd,
    train: Train,
    count?: number
  ): boolean;
  checkout(endPathBlockEnd: PathBlockEnd): void;
  requestPath(pathBlockEnd: PathBlockEnd, train: Train): void;
  addRule(rule: PathRule): void;
  removeRule(index: number): void;
  getPathBlockEnds(): PathBlockEnd[];
  tick(): void;
  getCoord(): Coordinate;
}
