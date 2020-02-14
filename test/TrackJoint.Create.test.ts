import { TrackJoint } from '../src/structs/TrackJoint/TrackJoint';
import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from './inversify.config';
import { TYPES } from '../src/structs/TYPES';
import { Track } from '../src/structs/Track/Track';
import { Coordinate } from '../src/structs/Geometry/Coordinate';
import { TrackSwitch } from '../src/structs/TrackSwitch/TrackSwitch';
chai.use(chaiAlmost());

const TrackJointFactory = testContainer.get<() => TrackJoint>(
  TYPES.FactoryOfTrackJoint
);

describe('Track joint - create', () => {
  it('creates new track', () => {
    const j1 = TrackJointFactory().init(0, 0, 0);
    const j2 = TrackJointFactory().init(0, 10, 0);
    const result = j1.connect(j2);

    const createdSegment = (result.track as Track).getSegment();
    expect(createdSegment.getFirstPoint()).deep.equals(new Coordinate(0, 0, 0));
    expect(createdSegment.getLastPoint()).deep.equals(new Coordinate(0, 0, 10));
  });

  it('creates new track, then switch', () => {
    const j1 = TrackJointFactory().init(0, 0, 0);
    const j2 = TrackJointFactory().init(0, 10, 0);
    const j3 = TrackJointFactory().init(5, 10, (1 / 4) * Math.PI);
    j2.connect(j1);
    const result = j3.connect(j1);

    const createdSegment1 = (result.track as TrackSwitch).getSegmentE();
    const createdSegment2 = (result.track as TrackSwitch).getSegmentF();
    expect(createdSegment1.getFirstPoint()).deep.equals(
      new Coordinate(0, 0, 0)
    );
    expect(createdSegment1.getLastPoint()).deep.equals(
      new Coordinate(0, 0, 10)
    );
    expect(createdSegment2.getFirstPoint()).deep.equals(
      new Coordinate(0, 0, 0)
    );
    expect(createdSegment2.getLastPoint()).deep.equals(
      new Coordinate(5, 0, 10)
    );
  });

  it('creates new track, then switch in opposite direction', () => {
    const j1 = TrackJointFactory().init(0, 0, 0);
    const j2 = TrackJointFactory().init(0, 10, 0);
    const j3 = TrackJointFactory().init(5, 0, -(1 / 4) * Math.PI);
    j2.connect(j1);
    const result = j2.connect(j3);

    const createdSegment1 = (result.track as TrackSwitch).getSegmentE();
    const createdSegment2 = (result.track as TrackSwitch).getSegmentF();
    expect(createdSegment1.getFirstPoint()).deep.equals(
      new Coordinate(0, 0, 10)
    );
    expect(createdSegment1.getLastPoint()).deep.equals(new Coordinate(0, 0, 0));
    expect(createdSegment2.getFirstPoint()).deep.equals(
      new Coordinate(0, 0, 10)
    );
    expect(createdSegment2.getLastPoint()).deep.equals(new Coordinate(5, 0, 0));
  });
});
