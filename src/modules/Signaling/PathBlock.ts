import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { BlockJointEnd } from './BlockJointEnd';
import { PathBlockEnd } from './PathBlockEnd';
import { Train } from '../Train/Train';
import { PathRule } from './PathRule';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { RailMapNode } from '../RailMap/RailMapNode';
import { PathRequest } from './PathRequest';
import { Station } from '../Station/Station';

export interface PathBlock extends BaseBrick, RailMapNode {
  init(jointEnds: BlockJointEnd[]): PathBlock;
  update(jointEnds: BlockJointEnd[]): void;
  empty(): void;
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
  highlight(light: boolean): void;
  setStation(station: Station): void;
  getStation(): Station;
}
