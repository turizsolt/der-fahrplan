import { PositionOnTrack } from './PositionOnTrack';
import { Train } from './Train';
import { NearestData } from './NearestData';

export class Nearest {
  static end(pot: PositionOnTrack): NearestData {
    let segmentCount = 1;
    let distance = pot.getTrack().getLength() - pot.getPosition();
    let iter = pot.getDirectedTrack();
    let ttl = 100;

    while (iter.next() && ttl) {
      iter = iter.next();
      distance += iter.getLength();
      segmentCount++;
      ttl--;
    }

    return {
      distance: ttl ? distance : Number.POSITIVE_INFINITY,
      segmentCount
    };
  }

  static train(pot: PositionOnTrack, train?: Train): NearestData {
    let segmentCount = 1;
    let distance = pot.getTrack().getLength() - pot.getPosition();
    let iter = pot.getDirectedTrack();
    let ttl = 100;
    let foundTrain: Train = null;

    for (let marker of iter.getMarkers()) {
      if (
        marker.position > pot.getPosition() &&
        marker.marker.type === 'Train'
      ) {
        distance = marker.position - pot.getPosition();
        foundTrain = marker.marker.train;
        break;
      }
    }

    iter = iter.next();
    while (iter && !foundTrain && ttl) {
      for (let marker of iter.getMarkers()) {
        if (marker.marker.type === 'Train') {
          distance += marker.position;
          foundTrain = marker.marker.train;
          break;
        }
      }

      if (!foundTrain) {
        distance += iter.getLength();
      }
      segmentCount++;
      ttl--;
      iter = iter.next();
    }

    return {
      distance: foundTrain ? distance : Number.POSITIVE_INFINITY,
      segmentCount,
      train: foundTrain
    };
  }
}
