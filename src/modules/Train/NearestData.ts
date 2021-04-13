import { Train } from './Train';

export interface NearestData {
  distance: number;
  segmentCount: number;
  train?: Train;
}
