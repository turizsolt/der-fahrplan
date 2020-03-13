import { TrackJoint } from './TrackJoint';
import { TrackBase } from '../TrackBase/TrackBase';
import { inject, injectable } from 'inversify';
import { TYPES } from '../TYPES';
import { Track } from '../Track/Track';
import { TrackSwitch } from '../TrackSwitch/TrackSwitch';
import { ActualTrackSwitch } from '../TrackSwitch/ActualTrackSwitch';

@injectable()
export class TrackJointConnector {
  @inject(TYPES.FactoryOfTrack) TrackFactory: () => Track;
  @inject(TYPES.FactoryOfTrackSwitch) TrackSwitchFactory: () => TrackSwitch;

  connect(one: TrackJoint, other: TrackJoint) {
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

    if (one.areBothEndsEmpty(oneEnd, otherEnd)) {
      const t = this.TrackFactory().init(coordinates);

      one.setOneEnd(oneEndLetter, t.getA());
      other.setOneEnd(otherEndLetter, t.getB());

      return { track: t };
    }

    if (one.isEndEmpty(oneEnd) || one.isEndEmpty(otherEnd)) {
      const oldTrack: TrackBase = oneEnd.track || otherEnd.track;
      if (oldTrack.constructor.name === ActualTrackSwitch.name) return false;

      const oldCoordinates = oldTrack.getSegment().getCoordinates();

      const sw = this.TrackSwitchFactory().init(oldCoordinates, coordinates);

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

      oldTrack.remove();

      // itt kéne valahol feldarabolni
      // sw.splitNatural();

      peak.setOneEnd(peakLetter, sw.getA());
      second.setOneEnd(secondLetter, sw.getE());
      third.setOneEnd(thirdLetter, sw.getF());

      return { track: sw, removed: oldTrack };
    }

    return false;
  }
}
