import { PathBlockEnd } from './PathBlockEnd';
import { Block } from './Block';

export interface AllowedPath {
  startPathBlockEnd: PathBlockEnd;
  endPathBlockEnd: PathBlockEnd;
  block: Block;
  count: number;
}
