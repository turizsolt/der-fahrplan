import { PositionOnTrack } from './PositionOnTrack';
import { NearestResult } from './NearestResult';

export class Nearest {
  static find(pot: PositionOnTrack): NearestResult {
    let segmentCount = 1;
    let distance = pot.getTrack().getLength() - pot.getPosition();
    let iter = pot.getDirectedTrack();
    while (iter.next()) {
      iter = iter.next();
      distance += iter.getLength();
      segmentCount++;
    }
    return {
      end: { distance, segmentCount },
      train: { distance, segmentCount }
    };
  }
}
