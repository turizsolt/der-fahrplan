import { PathBlockEnd } from './PathBlockEnd';

export interface PathRule {
  from: PathBlockEnd;
  toOptions: PathBlockEnd[];
}
