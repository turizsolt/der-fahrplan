import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BlockJointEnd } from './BlockJointEnd';
import { PathBlockEnd } from './PathBlockEnd';
import { Train } from '../Train/Train';
import { PathRule } from './PathRule';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { RailMapNode } from '../RailMap/RailMapNode';
import { PathRequest } from './PathRequest';

export interface PathBlock extends BaseBrick, RailMapNode {
  init(jointEnds: BlockJointEnd[]): PathBlock;
  allow(
    startPBE: PathBlockEnd,
    endPBE: PathBlockEnd,
    request: PathRequest,
    train: Train,
    count?: number
  ): boolean;
  checkout(endPathBlockEnd: PathBlockEnd): void;
  requestPath(pathBlockEnd: PathBlockEnd, train: Train): void;
  addRule(rule: PathRule): void;
  removeRule(index: number): void;
  setFilterToRule(index: number, filter: string): void;
  getPathBlockEnds(): PathBlockEnd[];
  tick(): void;
  getCoord(): Coordinate;
}
