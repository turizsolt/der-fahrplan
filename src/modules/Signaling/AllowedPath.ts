import { PathBlockEnd } from './PathBlockEnd';
import { Block } from './Block';
import { TrackSwitch } from '../Track/TrackSwitch';

export interface AllowedPath {
  startPathBlockEnd: PathBlockEnd;
  endPathBlockEnd: PathBlockEnd;
  block: Block;
  switches: TrackSwitch[];
  count: number;
}
