import { PositionOnTrack } from './PositionOnTrack';
import { NearestResult } from './NearestResult';

export class Nearest {
  static find(pot: PositionOnTrack): NearestResult {
    return {
      distance: 0,
      segmentCount: 1
    };
  }
}
