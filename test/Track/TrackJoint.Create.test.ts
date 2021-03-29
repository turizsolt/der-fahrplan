import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { getTestStore } from '../getTestStore';
import { TYPES } from '../../src/di/TYPES';
import { TrackJoint } from '../../src/modules/Track/TrackJoint/TrackJoint';
import { Ray } from '../../src/structs/Geometry/Ray';
chai.use(chaiAlmost());

const store = getTestStore();

describe('Track joint - create', () => {
  it('creates new joint', () => {
    const joint = store.create<TrackJoint>(TYPES.TrackJoint);
    joint.init(Ray.from(0, 0, 0, 0));
    expect(joint.getId()).not.equals(null);
  });
});
