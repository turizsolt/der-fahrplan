import { PositionOnTrack } from './PositionOnTrack';
import { NearestResult } from './NearestResult';
import { Train } from './Train';

export class Nearest {
  static find(pot: PositionOnTrack, train?: Train): NearestResult {
    let segmentCount = 1;
    let distance = pot.getTrack().getLength() - pot.getPosition();
    let trainSegmentCount = 1;
    let trainDistance = pot.getTrack().getLength() - pot.getPosition();
    let trainFound: Train = null;
    let isTrainFound = false;
    let iter = pot.getDirectedTrack();
    const possibleTrains = iter
      .getTrack()
      .getCheckedList()
      .filter(x => x !== train)
      .filter(x => x.getEndPosition().getPosition() > pot.getPosition());
    if (possibleTrains.length > 0) {
      isTrainFound = true;
      let min = Number.POSITIVE_INFINITY;
      for (let train of possibleTrains) {
        if (min > train.getEndPosition().getPosition() - pot.getPosition()) {
          min = train.getEndPosition().getPosition() - pot.getPosition();
          trainFound = train;
        }
      }
      trainDistance = min;
    }
    while (iter.next()) {
      iter = iter.next();
      distance += iter.getLength();
      segmentCount++;
      if (!isTrainFound) {
        const possibleTrains = iter
          .getTrack()
          .getCheckedList()
          .filter(x => x !== train);
        if (possibleTrains.length > 0) {
          isTrainFound = true;
          let min = Number.POSITIVE_INFINITY;
          for (let train of possibleTrains) {
            if (min > train.getEndPosition().getPosition()) {
              min = train.getEndPosition().getPosition();
              trainFound = train;
            }
          }
          trainDistance += min;
        } else {
          trainDistance += iter.getLength();
        }
        trainSegmentCount++;
      }
    }
    return {
      end: { distance, segmentCount },
      train: {
        distance: trainFound ? trainDistance : Number.POSITIVE_INFINITY,
        segmentCount: trainSegmentCount,
        train: trainFound
      }
    };
  }
}
