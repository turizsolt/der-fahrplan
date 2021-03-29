import { TrackJoint } from './TrackJoint';
import { TrackBase } from '../TrackBase';
import { ActualTrackSwitch } from '../ActualTrackSwitch';
import { CommandCreator } from '../../../structs/Actuals/Store/Command/CommandCreator';
import { GENERATE_ID } from '../../../structs/Actuals/Store/Command/CommandLog';
import { TrackJointEnd } from './TrackJointEnd';

export class TrackJointConnector {

  static connect(one: TrackJoint, other: TrackJoint) {
    const midpoint = one.getRay().computeMidpoint(other.getRay());

    if (midpoint === false) {
      return false;
    }

    const coordinates = [one.getPosition(), midpoint, other.getPosition()];

    const oneEndLetter = one.getRay().whichEnd(midpoint || other.getPosition());
    const oneEnd = one.getEnds()[oneEndLetter];

    const otherEndLetter = other
      .getRay()
      .whichEnd(midpoint || one.getPosition());
    const otherEnd = other.getEnds()[otherEndLetter];

    if (TrackJointConnector.areBothEndsEmpty(oneEnd, otherEnd)) {
      return [
        CommandCreator.joinTrackJoints(GENERATE_ID, coordinates, one.getId(), oneEndLetter, other.getId(), otherEndLetter)
      ];
    }

    if (TrackJointConnector.isEndEmpty(oneEnd) || TrackJointConnector.isEndEmpty(otherEnd)) {
      const oldTrack: TrackBase = oneEnd.track || otherEnd.track;
      if (oldTrack.constructor.name === ActualTrackSwitch.name) return false;

      const oldCoordinates = oldTrack.getSegment().getCoordinates();

      const thirdA = oldTrack.getA().getJointTo();
      const thirdB = oldTrack.getB().getJointTo();

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
      if (oldTrack.getA().getJointTo() === peak) {
        thirdLetter = oldTrack
          .getB()
          .getJointTo()
          .getTracksEnd(oldTrack);
      }
      if (oldTrack.getB().getJointTo() === peak) {
        thirdLetter = oldTrack
          .getA()
          .getJointTo()
          .getTracksEnd(oldTrack);
      }

      const j1 = oldTrack.getA().getJointTo();
      const j2 = oldTrack.getB().getJointTo();

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

  static isEndEmpty(end: TrackJointEnd): boolean {
    return !end.isSet();
  }

  static areBothEndsEmpty(oneEnd, otherEnd: TrackJointEnd): boolean {
    return TrackJointConnector.isEndEmpty(oneEnd) && TrackJointConnector.isEndEmpty(otherEnd);
  }

}
