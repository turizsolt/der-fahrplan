import { TrackJoint } from './TrackJoint';
import { ActualTrackSwitch } from '../ActualTrackSwitch';
import { CommandCreator } from '../../../structs/Actuals/Store/Command/CommandCreator';
import { GENERATE_ID } from '../../../structs/Actuals/Store/Command/CommandLog';
import { ActualTrackEnd } from '../ActualTrackEnd';
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

      const thirdA = oldTrack.getAx().getJointEnd().joint;
      const thirdB = oldTrack.getBx().getJointEnd().joint;

      let third, second, peak, peakLetter, secondLetter;
      if (thirdA === one) {
        third = thirdB;
        peak = one;
        peakLetter = oneEndLetter;
        second = other;
        secondLetter = otherEndLetter;
      } else if (thirdB === one) {
        third = thirdA;
        peak = one;
        peakLetter = oneEndLetter;
        second = other;
        secondLetter = otherEndLetter;
      } else if (thirdA === other) {
        third = thirdB;
        peak = other;
        peakLetter = otherEndLetter;
        second = one;
        secondLetter = oneEndLetter;
      } else if (thirdB === other) {
        third = thirdA;
        peak = other;
        peakLetter = otherEndLetter;
        second = one;
        secondLetter = oneEndLetter;
      }

      let thirdLetter;
      if (oldTrack.getAx().getJointEnd().joint === peak) {
        thirdLetter = oldTrack.getBx().getJointEnd().end;
      }
      if (oldTrack.getBx().getJointEnd().joint === peak) {
        thirdLetter = oldTrack.getAx().getJointEnd().end;
      }

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
          peak.getId(),
          peakLetter,
          second.getId(),
          secondLetter,
          third.getId(),
          thirdLetter
        )
      ];
    }

    return false;
  }

  static isEndEmpty(end: ActualTrackEnd): boolean {
    return !end;
  }

  static areBothEndsEmpty(oneEnd, otherEnd: ActualTrackEnd): boolean {
    return (
      TrackJointConnector.isEndEmpty(oneEnd) &&
      TrackJointConnector.isEndEmpty(otherEnd)
    );
  }
}
