import { TrackJoint } from './TrackJoint';
import { ActualTrackSwitch } from '../ActualTrackSwitch';
import { CommandCreator } from '../../../structs/Actuals/Store/Command/CommandCreator';
import { GENERATE_ID } from '../../../structs/Actuals/Store/Command/CommandLog';
import { TrackEnd } from '../TrackEnd';
import { Track } from '../Track';

export class TrackJointConnector {
  static connect(one: TrackJoint, other: TrackJoint) {
    const midpoint = one.getRay().computeMidpointIfAwayEnough(other.getRay());

    if (midpoint === false) {
      console.log('no midpoint false');
      return false;
    }

    const coordinates = [one.getPosition(), midpoint, other.getPosition()];

    const oneEndLetter = one.getRay().whichEnd(midpoint || other.getPosition());
    const oneEnd = one.getEnd(oneEndLetter);

    const otherEndLetter = other
      .getRay()
      .whichEnd(midpoint || one.getPosition());
    const otherEnd = other.getEnd(otherEndLetter);

    console.log('data', oneEndLetter, oneEnd, otherEndLetter, otherEnd, coordinates);

    if (TrackJointConnector.areBothEndsEmpty(oneEnd, otherEnd)) {
      return [
        CommandCreator.joinTrackJoints(
          GENERATE_ID,
          coordinates,
          one.getId(),
          oneEndLetter,
          other.getId(),
          otherEndLetter
        )
      ];
    }

    if (
      TrackJointConnector.isEndEmpty(oneEnd) ||
      TrackJointConnector.isEndEmpty(otherEnd)
    ) {
      const oldTrack: Track = ((oneEnd && oneEnd.getTrack()) ||
        (otherEnd && otherEnd.getTrack())) as Track;
      console.log('oldTrack', oldTrack, (oneEnd && oneEnd.getTrack()),
        (otherEnd && otherEnd.getTrack()));
      if (oldTrack.constructor.name === ActualTrackSwitch.name) {
        console.log('switch false');
        return false;
      }

      const oldCoordinates = oldTrack.getCurve().getCoordinates();
      const j1 = oldTrack.getAx().getJointEnd().joint;
      const j2 = oldTrack.getBx().getJointEnd().joint;

      return [
        CommandCreator.unjoinTrackJoints(
          oldTrack.getId(),
          oldCoordinates,
          j1.getId(),
          j1.getTracksEnd(oldTrack),
          j2.getId(),
          j2.getTracksEnd(oldTrack)
        ),
        CommandCreator.joinTrackJoints3(
          GENERATE_ID,
          oldCoordinates,
          coordinates,
          j1.getId(),
          j1.getTracksEnd(oldTrack),
          j2.getId(),
          j2.getTracksEnd(oldTrack),
          one.getId(),
          oneEndLetter,
          other.getId(),
          otherEndLetter
        )
      ];
    }

    console.log('unknown false');
    return false;
  }

  static isEndEmpty(end: TrackEnd): boolean {
    return !end;
  }

  static areBothEndsEmpty(oneEnd, otherEnd: TrackEnd): boolean {
    return (
      TrackJointConnector.isEndEmpty(oneEnd) &&
      TrackJointConnector.isEndEmpty(otherEnd)
    );
  }
}
