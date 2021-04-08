import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { getTestStore } from '../../getTestStore';
import { TYPES } from '../../../src/di/TYPES';
import { TrackJoint } from '../../../src/modules/Track/TrackJoint/TrackJoint';
import { Ray } from '../../../src/structs/Geometry/Ray';
import { TrackJointConnector } from '../../../src/modules/Track/TrackJoint/TrackJointConnector';
chai.use(chaiAlmost());

const store = getTestStore();

describe('Track joint', () => {
  it('creates new joint', () => {
    const joint = store.create<TrackJoint>(TYPES.TrackJoint);
    joint.init(Ray.from(0, 0, 0, 0));
    expect(joint.getId()).not.equals(null);
  });

  it('join two joints', () => {
    const j1 = store
      .create<TrackJoint>(TYPES.TrackJoint)
      .init(Ray.from(0, 0, 0, 0));
    const j2 = store
      .create<TrackJoint>(TYPES.TrackJoint)
      .init(Ray.from(0, 0, 100, 0));
    expect(TrackJointConnector.connect(j1, j2)).not.equals(false);
  });
});
