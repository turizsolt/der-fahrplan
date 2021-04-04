import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { TYPES } from '../../src/di/TYPES';
import { Track } from '../../src/modules/Track/Track';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { getTestStore } from '../getTestStore';
import { TrackJoint } from '../../src/modules/Track/TrackJoint/TrackJoint';
import { Ray } from '../../src/structs/Geometry/Ray';
import { WhichEnd } from '../../src/structs/Interfaces/WhichEnd';
chai.use(chaiAlmost());

const store = getTestStore();

describe('Track', () => {
  it('create a track', () => {
    const j1 = store
      .create<TrackJoint>(TYPES.TrackJoint)
      .init(Ray.from(0, 0, 0, 0));
    const j2 = store
      .create<TrackJoint>(TYPES.TrackJoint)
      .init(Ray.from(0, 0, 100, 0));
    const track = store.create<Track>(TYPES.Track).init({
      coordinates: [new Coordinate(0, 0, 0), new Coordinate(0, 0, 100)],
      startJointEnd: { joint: j1, end: WhichEnd.A },
      endJointEnd: { joint: j2, end: WhichEnd.B }
    });
  });
});
