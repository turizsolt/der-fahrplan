import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { DirectedTrack } from '../../../src/modules/Track/DirectedTrack';
import { TrackSegment } from '../../../src/modules/Track/TrackSegment';
import { ActualTrackEnd } from '../../../src/modules/Track/ActualTrackEnd';
import { WhichEnd } from '../../../src/structs/Interfaces/WhichEnd';
import { TrackBase } from '../../../src/modules/Track/TrackBase';
import { TrackJointEnd } from '../../../src/modules/Track/TrackJoint/TrackJointEnd';
import { getTestStore } from '../../getTestStore';
import { TrackJoint } from '../../../src/modules/Track/TrackJoint/TrackJoint';
import { TYPES } from '../../../src/di/TYPES';
import { Ray } from '../../../src/structs/Geometry/Ray';
chai.use(chaiAlmost());

const store = getTestStore();

const mockTrackBase: TrackBase = {
  addPlatform: () => {},
  checkin: () => {},
  checkout: () => {},
  deselect: () => {},
  getCheckedList: () => null,
  getCurve: () => null,
  getId: () => null,
  getLength: () => null,
  getPlatformsBeside: () => {},
  getRenderer: () => null,
  getType: () => null,
  isEmpty: () => null,
  isRemovable: () => null,
  isSelected: () => null,
  load: () => {},
  onSelectChanged: () => {},
  persist: () => null,
  persistDeep: () => null,
  persistShallow: () => null,
  presetId: () => {},
  remove: () => {},
  removeSelect: () => {},
  select: () => {},
  toggleSelect: () => {},
  update: () => {},
  getDirected: () => null
};

const mockTrackSegment: TrackSegment = {
  connect: () => {},
  disconnect: () => {},
  getCurve: () => null,
  getEnd: () => null,
  getTrack: () => mockTrackBase,
  remove: () => {},
  getDirected: () => null,
  getLength: () => null
};
const mockDirectedTrack: DirectedTrack = {
  next: () => null,
  reverse: () => null,
  setNext: () => {},
  setReverse: () => {},
  getSegment: () => mockTrackSegment,
  getCurve: () => null,
  getLength: () => null,
  getTrack: () => null
};
const mockDirectedTrack2: DirectedTrack = { ...mockDirectedTrack };

describe('TrackEnd', () => {
  it('create an end', () => {
    const jointEnd = {
      joint: null,
      end: WhichEnd.A
    };
    const end = new ActualTrackEnd(
      mockDirectedTrack,
      mockDirectedTrack2,
      jointEnd
    );
    expect(end).not.equals(null);
    expect(end.getStart()).equals(mockDirectedTrack);
    expect(end.getEnd()).equals(mockDirectedTrack2);
    expect(end.getJointEnd()).equals(jointEnd);
    expect(end.getSegment()).equals(mockTrackSegment);
    expect(end.getTrack()).equals(mockTrackBase);
  });

  it('connect and disconnect an end', () => {
    let ok = 0;

    const jointEnd: TrackJointEnd = {
      joint: store
        .create<TrackJoint>(TYPES.TrackJoint)
        .init(Ray.from(0, 0, 0, 0)),
      end: WhichEnd.A
    };
    jointEnd.joint.setOneEnd = () => {
      ok += 1;
    };
    jointEnd.joint.removeEnd = () => {
      ok += 2;
    };
    const end = new ActualTrackEnd(
      mockDirectedTrack,
      mockDirectedTrack2,
      jointEnd
    );

    end.connect();
    end.disconnect();

    expect(ok).equals(3);
  });
});
