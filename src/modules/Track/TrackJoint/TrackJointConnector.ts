import { TrackJoint } from './TrackJoint';
import { ActualTrackSwitch } from '../ActualTrackSwitch';
import { CommandCreator } from '../../../structs/Actuals/Store/Command/CommandCreator';
import { GENERATE_ID } from '../../../structs/Actuals/Store/Command/CommandLog';
import { TrackEnd } from '../TrackEnd';
import { Track } from '../Track';

export class TrackJointConnector {
  static connect(one: TrackJoint, other: TrackJoint) {
    const midpoint = one.getRay().computeMidpoint(other.getRay());

    if (midpoint === false) {
      return false;
    }

    const coordinates = [one.getPosition(), midpoint, other.getPosition()];

    const oneEndLetter = one.getRay().whichEnd(midpoint || other.getPosition());
    const oneEnd = one.getEnd(oneEndLetter);

    const otherEndLetter = other
      .getRay()
      .whichEnd(midpoint || one.getPosition());
    const otherEnd = other.getEnd(otherEndLetter);

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
      if (oldTrack.constructor.name === ActualTrackSwitch.name) return false;

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
