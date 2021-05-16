import { PathBlockEnd } from './PathBlockEnd';
import { Train } from '../Train/Train';

export interface PathRequest {
  from: PathBlockEnd;
  train: Train;
  toOptions: PathBlockEnd[];
}
