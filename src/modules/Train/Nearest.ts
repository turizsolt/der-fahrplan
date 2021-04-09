import { PositionOnTrack } from './PositionOnTrack';
import { NearestResult } from './NearestResult';

export class Nearest {
  static find(pot: PositionOnTrack): NearestResult {
    return {
      distance: pot.getTrack().getLength() - pot.getPosition(),
      segmentCount: 1
    };
  }
}
