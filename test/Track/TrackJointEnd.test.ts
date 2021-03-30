import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { TYPES } from '../../src/di/TYPES';
import { DirectedTrack } from '../../src/modules/Track/DirectedTrack';
import { Track } from '../../src/modules/Track/Track';
import { TrackJointEnd } from '../../src/modules/Track/TrackJoint/TrackJointEnd';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { getTestStore } from '../getTestStore';
chai.use(chaiAlmost());

const store = getTestStore();
const createTrackJointEnd = () => new TrackJointEnd(); //store.create<DirectedTrack>(TYPES.DirectedTrack).init();
const createDirectedTrack = () => store.create<DirectedTrack>(TYPES.DirectedTrack).init(null);

// describe('TrackJointEnd', () => {
//   it('create a joint end', () => {
//     const je = createTrackJointEnd();
//     const track = store.create<Track>(TYPES.Track).init([new Coordinate(0, 0, 0), new Coordinate(0, 0, 100)]);
//     const startDt = createDirectedTrack();
//     const endDt = createDirectedTrack();
//     je.setEnd(track, startDt, endDt);
//     expect(je.getTrack()).not.equals(null);
//     expect(je.getStart()).not.equals(null);
//     expect(je.getEnd()).not.equals(null);
//     expect(je.isSet()).equals(true);
//     je.unsetEnd();
//     expect(je.isSet()).equals(false);
//   });
// });
