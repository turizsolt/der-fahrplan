import { ActualTrackCurve } from './ActualTrackCurve';
import { TrackCurve } from './TrackCurve';
import { Left, Right } from '../../structs/Geometry/Directions';
import { TrackJointEnd } from './TrackJoint/TrackJointEnd';
import { TrackSegmentData } from './TrackSegmentData';

export class TrackSwitchCoordinates {
  static align(
    segmentData1: TrackSegmentData,
    segmentData2: TrackSegmentData
  ): TrackSegmentData[] {
    const tempE = new ActualTrackCurve(segmentData1.coordinates);
    const tempF = new ActualTrackCurve(segmentData2.coordinates);

    if (
      tempE
        .getLineSegmentChain()
        .copyMove(Right, 1)
        .isIntersectsWithChain(tempF.getLineSegmentChain().copyMove(Left, 1))
    ) {
      return [segmentData1, segmentData2];
    } else {
      return [segmentData2, segmentData1];
    }
    /*
    const last1 = segmentData1.coordinates.length - 1;
    const last2 = segmentData2.coordinates.length - 1;
    let tempE: TrackCurve, tempF: TrackCurve;
    let tj: TrackJointEnd[];
    if (segmentData1.coordinates[0].equalsTo(segmentData2.coordinates[0])) {
      console.log('tsw 0');
      // console.log('sd', segmentData1, segmentData2);
      tempE = new ActualTrackCurve(segmentData1.coordinates);
      tempF = new ActualTrackCurve(segmentData2.coordinates);
      tj = [
        segmentData1.startJointEnd,
        segmentData1.endJointEnd,
        segmentData2.startJointEnd,
        segmentData2.endJointEnd
      ];
    } else if (
      segmentData1.coordinates[last1].equalsTo(segmentData2.coordinates[last2])
    ) {
      console.log('tsw 3');
      tempE = new ActualTrackCurve([...segmentData1.coordinates].reverse());
      tempF = new ActualTrackCurve([...segmentData2.coordinates].reverse());
      tj = [
        segmentData1.endJointEnd,
        segmentData1.startJointEnd,
        segmentData2.endJointEnd,
        segmentData2.startJointEnd
      ];
    } else if (
      segmentData1.coordinates[0].equalsTo(segmentData2.coordinates[last2])
    ) {
      console.log('tsw 2');
      tempE = new ActualTrackCurve(segmentData1.coordinates);
      tempF = new ActualTrackCurve([...segmentData2.coordinates].reverse());
      tj = [
        segmentData1.startJointEnd,
        segmentData1.endJointEnd,
        segmentData2.endJointEnd,
        segmentData2.startJointEnd
      ];
    } else if (
      segmentData1.coordinates[last1].equalsTo(segmentData2.coordinates[0])
    ) {
      console.log('tsw 1');
      tempE = new ActualTrackCurve([...segmentData1.coordinates].reverse());
      tempF = new ActualTrackCurve(segmentData2.coordinates);
      tj = [
        segmentData1.endJointEnd,
        segmentData1.startJointEnd,
        segmentData2.startJointEnd,
        segmentData2.endJointEnd
      ];
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
      console.log('ef EF');
      return [
        {
          startJointEnd: tj[0],
          endJointEnd: tj[1],
          coordinates: tempE.getCoordinates()
        },
        {
          startJointEnd: tj[2],
          endJointEnd: tj[3],
          coordinates: tempF.getCoordinates()
        }
      ];
    } else {
      console.log('ef FE');
      return [
        {
          startJointEnd: tj[2],
          endJointEnd: tj[3],
          coordinates: tempF.getCoordinates()
        },
        {
          startJointEnd: tj[0],
          endJointEnd: tj[1],
          coordinates: tempE.getCoordinates()
        }
      ];
    }
    */
  }
}
