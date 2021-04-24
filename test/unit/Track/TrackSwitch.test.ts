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
const BA = TrackDirection.BA;

const createTrackJoint = (
  x: number,
  y: number,
  z: number,
  dirXZ: number,
  id: string
): TrackJoint => {
  const joint = store.create<TrackJoint>(TYPES.TrackJoint);
  joint.presetId(id);
  return joint.init(Ray.from(x, y, z, dirXZ));
};

const connectJointsToTrack = (
  joint0: TrackJoint,
  joint1: TrackJoint,
  id: string
): Track => {
  const track = store.create<Track>(TYPES.Track);
  track.presetId(id);
  return track.init({
    startJointEnd: { joint: joint0, end: WhichEnd.B },
    endJointEnd: { joint: joint1, end: WhichEnd.A },
    coordinates: [joint0.getPosition(), joint1.getPosition()]
  });
};

const initJointsAndTracks = () => {
  store.clear();
  const joint0 = createTrackJoint(0, 0, 0, 0, 'joint0');
  const joint1 = createTrackJoint(0, 0, 20, 0, 'joint1');
  const joint2 = createTrackJoint(0, 0, 40, 0, 'joint2');
  const joint3 = createTrackJoint(0, 0, 60, 0, 'joint3');
  const corner = new Coordinate(0, 0, 30);
  const joint8 = createTrackJoint(10, 0, 40, Math.PI / 4, 'joint8');
  const joint9 = createTrackJoint(30, 0, 60, Math.PI / 4, 'joint9');

  const track01 = connectJointsToTrack(joint0, joint1, 'track01');
  const track23 = connectJointsToTrack(joint2, joint3, 'track23');
  const track89 = connectJointsToTrack(joint8, joint9, 'track89');
  return { joint1, joint2, joint8, corner, track01, track23, track89 };
};

const expectNextOf = (
  t0: TrackBase,
  d0: TrackDirection,
  t1: TrackBase,
  d1: TrackDirection
): void => {
  /*console.log(
    t0
      .getDirected(d0)
      .next()
      .getHash(),
    t1.getDirected(d1).getHash()
  );*/
  expect(
    t0
      .getDirected(d0)
      .next()
      .getHash()
  ).equals(t1.getDirected(d1).getHash());
};

describe('TrackSwitch', () => {
  it('create 1->2, 1->8', () => {
    const {
      joint1,
      joint2,
      joint8,
      corner,
      track01,
      track23,
      track89
    } = initJointsAndTracks();

    const trackSwitch128 = store.create<TrackSwitch>(TYPES.TrackSwitch);
    trackSwitch128.presetId('trackSwitch128');
    trackSwitch128.init(
      {
        startJointEnd: { joint: joint1, end: WhichEnd.B },
        endJointEnd: { joint: joint2, end: WhichEnd.A },
        coordinates: [joint1.getPosition(), joint2.getPosition()]
      },
      {
        startJointEnd: { joint: joint1, end: WhichEnd.B },
        endJointEnd: { joint: joint8, end: WhichEnd.A },
        coordinates: [joint1.getPosition(), corner, joint8.getPosition()]
      }
    );

    expectNextOf(track01, AB, trackSwitch128, AB);
    expectNextOf(trackSwitch128, AB, track23, AB);
    expect(
      trackSwitch128
        .getActiveSegment()
        .getCurve()
        .getCoordinates()
    ).deep.equals([joint1.getPosition(), joint2.getPosition()]);

    trackSwitch128.switch();

    expectNextOf(track01, AB, trackSwitch128, AB);
    expectNextOf(trackSwitch128, AB, track89, AB);
    expect(
      trackSwitch128
        .getActiveSegment()
        .getCurve()
        .getCoordinates()
    ).deep.equals([joint1.getPosition(), corner, joint8.getPosition()]);
  });

  it('create 1->8, 1->2', () => {
    const {
      joint1,
      joint2,
      joint8,
      corner,
      track01,
      track23,
      track89
    } = initJointsAndTracks();

    const trackSwitch128 = store.create<TrackSwitch>(TYPES.TrackSwitch);
    trackSwitch128.presetId('trackSwitch128');
    trackSwitch128.init(
      {
        startJointEnd: { joint: joint1, end: WhichEnd.B },
        endJointEnd: { joint: joint8, end: WhichEnd.A },
        coordinates: [joint1.getPosition(), corner, joint8.getPosition()]
      },
      {
        startJointEnd: { joint: joint1, end: WhichEnd.B },
        endJointEnd: { joint: joint2, end: WhichEnd.A },
        coordinates: [joint1.getPosition(), joint2.getPosition()]
      }
    );

    expectNextOf(track01, AB, trackSwitch128, AB);
    expectNextOf(trackSwitch128, AB, track23, AB);
    expect(
      trackSwitch128
        .getActiveSegment()
        .getCurve()
        .getCoordinates()
    ).deep.equals([joint1.getPosition(), joint2.getPosition()]);

    trackSwitch128.switch();

    expectNextOf(track01, AB, trackSwitch128, AB);
    expectNextOf(trackSwitch128, AB, track89, AB);
    expect(
      trackSwitch128
        .getActiveSegment()
        .getCurve()
        .getCoordinates()
    ).deep.equals([joint1.getPosition(), corner, joint8.getPosition()]);
  });
});
