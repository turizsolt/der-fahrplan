import { Coordinate } from '../../structs/Geometry/Coordinate';
import { ActualTrackCurve } from './ActualTrackCurve';
import { TrackCurve } from './TrackCurve';
import { Left, Right } from '../../structs/Geometry/Directions';
import { TrackJointEnd } from './TrackJoint/TrackJointEnd';

export class TrackSwitchCoordinates {
  static align(
    coordinates1: Coordinate[],
    coordinates2: Coordinate[],
    jointEnds: TrackJointEnd[]
  ): (Coordinate[] | TrackJointEnd[])[] {
    const last1 = coordinates1.length - 1;
    const last2 = coordinates2.length - 1;
    let tempE: TrackCurve, tempF: TrackCurve;
    let tj: TrackJointEnd[];
    if (coordinates1[0].equalsTo(coordinates2[0])) {
      tempE = new ActualTrackCurve(coordinates1);
      tempF = new ActualTrackCurve(coordinates2);
      tj = [jointEnds[0], jointEnds[1], jointEnds[2], jointEnds[3]];
    } else if (coordinates1[last1].equalsTo(coordinates2[last2])) {
      tempE = new ActualTrackCurve(coordinates1.reverse());
      tempF = new ActualTrackCurve(coordinates2.reverse());
      tj = [jointEnds[1], jointEnds[0], jointEnds[3], jointEnds[2]];
    } else if (coordinates1[0].equalsTo(coordinates2[last2])) {
      tempE = new ActualTrackCurve(coordinates1);
      tempF = new ActualTrackCurve(coordinates2.reverse());
      tj = [jointEnds[0], jointEnds[1], jointEnds[3], jointEnds[2]];
    } else if (coordinates1[last1].equalsTo(coordinates2[0])) {
      tempE = new ActualTrackCurve(coordinates1.reverse());
      tempF = new ActualTrackCurve(coordinates2);
      tj = [jointEnds[1], jointEnds[0], jointEnds[2], jointEnds[3]];
    } else {
      throw new Error('Segments has no meeting point');
    }

    // decides which is the left one
    if (
      tempE
        .getLineSegmentChain()
        .copyMove(Right, 1)
        .isIntersectsWithChain(tempF.getLineSegmentChain().copyMove(Left, 1))
    ) {
      return [
        tempE.getCoordinates(),
        tempF.getCoordinates(),
        [tj[0], tj[1], tj[2], tj[3]]
      ];
    } else {
      return [
        tempF.getCoordinates(),
        tempE.getCoordinates(),
        [tj[2], tj[3], tj[0], tj[1]]
      ];
    }
  }
}
