import { PositionOnTrack } from './PositionOnTrack';
import { Train } from './Train';
import { TrackDirection } from '../Track/TrackDirection';
import { NearestData } from './NearestData';
import { DirectedTrack } from '../Track/DirectedTrack';

export class Nearest {
  static end(pot: PositionOnTrack): NearestData {
    let segmentCount = 1;
    let distance = pot.getTrack().getLength() - pot.getPosition();
    let iter = pot.getDirectedTrack();

    while (iter.next()) {
      iter = iter.next();
      distance += iter.getLength();
      segmentCount++;
    }

    return { distance, segmentCount };
  }

  static train(pot: PositionOnTrack, train?: Train): NearestData {
    let segmentCount = 0;
    let distance = 0;
    let trainFound: Train = null;
    let iter = pot.getDirectedTrack();
    let position = pot.getPosition();

    do {
      const { train: trainX, distance: distX } = Nearest.findInsideTrack(
        iter,
        train,
        position
      );
      distance += distX;
      trainFound = trainX;
      position = 0;
      segmentCount++;
      iter = iter.next();
    } while (iter && !trainFound);

    return {
      distance: trainFound ? distance : Number.POSITIVE_INFINITY,
      segmentCount: segmentCount,
      train: trainFound
    };
  }

  private static findInsideTrack(
    iter: DirectedTrack,
    train: Train,
    position: number
  ) {
    let trainFound: Train = null;
    let min = iter.getLength() - position;

    const possibleTrains = iter
      .getTrack()
      .getCheckedList()
      .filter(x => x !== train && Nearest.getNearestEndPosition(x) > position);
    if (possibleTrains.length > 0) {
      for (let train of possibleTrains) {
        const otherPosition = Nearest.getNearestEndPosition(train);

        if (min > otherPosition - position) {
          min = otherPosition - position;
          trainFound = train;
        }
      }
    }

    return { train: trainFound, distance: min };
  }

  private static getNearestEndPosition(train: Train): number {
    if (
      train
        .getEndPosition()
        .getDirectedTrack()
        .getDirection() === TrackDirection.BA
    ) {
      return (
        train
          .getPosition()
          .getTrack()
          .getLength() - train.getPosition().getPosition()
      );
    } else {
      return train.getEndPosition().getPosition();
    }
  }
}
