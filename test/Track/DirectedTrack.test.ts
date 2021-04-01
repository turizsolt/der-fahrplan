import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { DirectedTrack } from '../../src/modules/Track/DirectedTrack';
import { ActualDirectedTrack } from '../../src/modules/Track/ActualDirectedTrack';
import { TrackSegment } from '../../src/modules/Track/TrackSegment';
chai.use(chaiAlmost());

const mockTrackSegment: TrackSegment = {
  connect: () => {},
  disconnect: () => {},
  getCurve: () => null,
  getEnd: () => null,
  getTrack: () => null,
  remove: () => {}
};
const createDirectedTrack = (segment?: TrackSegment): DirectedTrack =>
  new ActualDirectedTrack(segment);

describe('DirectedTrack', () => {
  it('create a dt', () => {
    const dt = createDirectedTrack();
    expect(dt).not.equals(null);
  });

  it('reverse a dt, without setting it', () => {
    const dt = createDirectedTrack();
    expect(dt.reverse()).equals(null);
  });

  it('reverse a dt', () => {
    const dt = createDirectedTrack();
    const dt2 = createDirectedTrack();
    dt.setReverse(dt2);
    expect(dt.reverse()).equals(dt2);
  });

  it('next a dt, without setting it', () => {
    const dt = createDirectedTrack();
    expect(dt.next()).equals(null);
  });

  it('next a dt', () => {
    const dt = createDirectedTrack();
    const dt2 = createDirectedTrack();
    dt.setNext(dt2);
    expect(dt.next()).equals(dt2);
  });

  it('getSegment of dt', () => {
    const dt = createDirectedTrack(mockTrackSegment);
    expect(dt.getSegment()).equals(mockTrackSegment);
  });
});
