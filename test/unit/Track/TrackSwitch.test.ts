import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { getTestStore } from '../../getTestStore';
import { TrackJoint } from '../../../src/modules/Track/TrackJoint/TrackJoint';
import { TYPES } from '../../../src/di/TYPES';
import { Ray } from '../../../src/structs/Geometry/Ray';
import { Track } from '../../../src/modules/Track/Track';
import { WhichEnd } from '../../../src/structs/Interfaces/WhichEnd';
import { TrackSwitch } from '../../../src/modules/Track/TrackSwitch';
import { Coordinate } from '../../../src/structs/Geometry/Coordinate';
import { TrackDirection } from '../../../src/modules/Track/TrackDirection';
import { TrackBase } from '../../../src/modules/Track/TrackBase';
chai.use(chaiAlmost());

const store = getTestStore();

const AB = TrackDirection.AB;

const createTrackJoint = (
  x: number,
  y: number,
  z: number,
  dirXZ: number
): TrackJoint => {
  return store
    .create<TrackJoint>(TYPES.TrackJoint)
    .init(Ray.from(x, y, z, dirXZ));
};

const connectJointsToTrack = (
  joint0: TrackJoint,
  joint1: TrackJoint
): Track => {
  return store.create<Track>(TYPES.Track).init({
    startJointEnd: { joint: joint0, end: WhichEnd.B },
    endJointEnd: { joint: joint1, end: WhichEnd.A },
    coordinates: [joint0.getPosition(), joint1.getPosition()]
  });
};

const initJointsAndTracks = () => {
  const joint0 = createTrackJoint(0, 0, 0, 0);
  const joint1 = createTrackJoint(0, 0, 20, 0);
  const joint2 = createTrackJoint(0, 0, 40, 0);
  const joint3 = createTrackJoint(0, 0, 60, 0);
  const corner = new Coordinate(0, 0, 30);
  const joint8 = createTrackJoint(10, 0, 40, Math.PI / 4);
  const joint9 = createTrackJoint(30, 0, 60, Math.PI / 4);

  const track01 = connectJointsToTrack(joint0, joint1);
  const track23 = connectJointsToTrack(joint2, joint3);
  const track89 = connectJointsToTrack(joint8, joint9);
  return { joint1, joint2, joint3, joint8, corner, track01, track23, track89 };
};

const expectNextOf = (
  t0: TrackBase,
  d0: TrackDirection,
  t1: TrackBase,
  d1: TrackDirection
): void => {
  expect(
    t0
      .getDirected(d0)
      .next()
      .getHash()
  ).equals(t1.getDirected(d1).getHash());
};

const expectTheSame = (
  r: {
    joint1: TrackJoint;
    joint2: TrackJoint;
    joint8: TrackJoint;
    corner: Coordinate;
    track01: Track;
    track23: Track;
    track89: Track;
  },
  trackSwitch128: TrackSwitch
) => {
  expectNextOf(r.track01, AB, trackSwitch128, AB);
  expectNextOf(trackSwitch128, AB, r.track23, AB);
  expect(
    trackSwitch128
      .getActiveSegment()
      .getCurve()
      .getCoordinates()
  ).deep.equals([r.joint1.getPosition(), r.joint2.getPosition()]);

  trackSwitch128.switch();

  expectNextOf(r.track01, AB, trackSwitch128, AB);
  expectNextOf(trackSwitch128, AB, r.track89, AB);
  expect(
    trackSwitch128
      .getActiveSegment()
      .getCurve()
      .getCoordinates()
  ).deep.equals([r.joint1.getPosition(), r.corner, r.joint8.getPosition()]);
};

describe('TrackSwitch', () => {
  it('create 1->2, 1->8', () => {
    const r = initJointsAndTracks();

    const trackSwitch128 = store.create<TrackSwitch>(TYPES.TrackSwitch).init(
      {
        startJointEnd: { joint: r.joint1, end: WhichEnd.B },
        endJointEnd: { joint: r.joint2, end: WhichEnd.A },
        coordinates: [r.joint1.getPosition(), r.joint2.getPosition()]
      },
      {
        startJointEnd: { joint: r.joint1, end: WhichEnd.B },
        endJointEnd: { joint: r.joint8, end: WhichEnd.A },
        coordinates: [r.joint1.getPosition(), r.corner, r.joint8.getPosition()]
      }
    );

    expectTheSame(r, trackSwitch128);
  });

  it('create 1->8, 1->2', () => {
    const r = initJointsAndTracks();

    const trackSwitch128 = store.create<TrackSwitch>(TYPES.TrackSwitch).init(
      {
        startJointEnd: { joint: r.joint1, end: WhichEnd.B },
        endJointEnd: { joint: r.joint8, end: WhichEnd.A },
        coordinates: [r.joint1.getPosition(), r.corner, r.joint8.getPosition()]
      },
      {
        startJointEnd: { joint: r.joint1, end: WhichEnd.B },
        endJointEnd: { joint: r.joint2, end: WhichEnd.A },
        coordinates: [r.joint1.getPosition(), r.joint2.getPosition()]
      }
    );

    expectTheSame(r, trackSwitch128);
  });

  it('create 2->1, 8->1', () => {
    const r = initJointsAndTracks();

    const trackSwitch128 = store.create<TrackSwitch>(TYPES.TrackSwitch).init(
      {
        startJointEnd: { joint: r.joint2, end: WhichEnd.A },
        endJointEnd: { joint: r.joint1, end: WhichEnd.B },
        coordinates: [r.joint2.getPosition(), r.joint1.getPosition()]
      },
      {
        startJointEnd: { joint: r.joint8, end: WhichEnd.A },
        endJointEnd: { joint: r.joint1, end: WhichEnd.B },
        coordinates: [r.joint8.getPosition(), r.corner, r.joint1.getPosition()]
      }
    );

    expectTheSame(r, trackSwitch128);
  });

  it('create 1->2, 8->1', () => {
    const r = initJointsAndTracks();

    const trackSwitch128 = store.create<TrackSwitch>(TYPES.TrackSwitch).init(
      {
        startJointEnd: { joint: r.joint1, end: WhichEnd.B },
        endJointEnd: { joint: r.joint2, end: WhichEnd.A },
        coordinates: [r.joint1.getPosition(), r.joint2.getPosition()]
      },
      {
        startJointEnd: { joint: r.joint8, end: WhichEnd.A },
        endJointEnd: { joint: r.joint1, end: WhichEnd.B },
        coordinates: [r.joint8.getPosition(), r.corner, r.joint1.getPosition()]
      }
    );

    expectTheSame(r, trackSwitch128);
  });

  it('create 2->1, 1->8', () => {
    const r = initJointsAndTracks();

    const trackSwitch128 = store.create<TrackSwitch>(TYPES.TrackSwitch).init(
      {
        startJointEnd: { joint: r.joint2, end: WhichEnd.A },
        endJointEnd: { joint: r.joint1, end: WhichEnd.B },
        coordinates: [r.joint2.getPosition(), r.joint1.getPosition()]
      },
      {
        startJointEnd: { joint: r.joint1, end: WhichEnd.B },
        endJointEnd: { joint: r.joint8, end: WhichEnd.A },
        coordinates: [r.joint1.getPosition(), r.corner, r.joint8.getPosition()]
      }
    );

    expectTheSame(r, trackSwitch128);
  });

  it('throw: no meeting point', () => {
    const r = initJointsAndTracks();

    expect(() =>
      store.create<TrackSwitch>(TYPES.TrackSwitch).init(
        {
          startJointEnd: { joint: r.joint1, end: WhichEnd.B },
          endJointEnd: { joint: r.joint8, end: WhichEnd.A },
          coordinates: [
            r.joint1.getPosition(),
            r.corner,
            r.joint8.getPosition()
          ]
        },
        {
          startJointEnd: { joint: r.joint2, end: WhichEnd.A },
          endJointEnd: { joint: r.joint3, end: WhichEnd.B },
          coordinates: [r.joint2.getPosition(), r.joint3.getPosition()]
        }
      )
    ).to.throw('Segments has no meeting point');
  });
});
