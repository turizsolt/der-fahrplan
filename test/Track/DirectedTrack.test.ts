import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { TYPES } from '../../src/di/TYPES';
import { DirectedTrack } from '../../src/modules/Track/DirectedTrack';
import { getTestStore } from '../getTestStore';
chai.use(chaiAlmost());

const store = getTestStore();
const createDirectedTrack = () => store.create<DirectedTrack>(TYPES.DirectedTrack).init(null);

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
});
