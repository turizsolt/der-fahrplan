import { Train } from './Train';
import { Signal } from '../Signaling/Signal';

export interface NearestData {
  distance: number;
  segmentCount: number;
  train?: Train;
  signal?: Signal;
}
