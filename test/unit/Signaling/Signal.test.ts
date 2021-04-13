import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { getTestStore } from '../../getTestStore';
import { Signal } from '../../../src/modules/Signaling/Signal';
import { TYPES } from '../../../src/di/TYPES';
import { SignalSignal } from '../../../src/modules/Signaling/SignalSignal';
import { PositionOnTrack } from '../../../src/modules/Train/PositionOnTrack';
import { createTrack } from '../Track/util';
import { TrackDirection } from '../../../src/modules/Track/TrackDirection';
chai.use(chaiAlmost());

const store = getTestStore();
const { track } = createTrack(100);
const pos = new PositionOnTrack(track, 0, TrackDirection.AB);

describe('Signal', () => {
  it('gets a SignalSignal', () => {
    const signal = store.create<Signal>(TYPES.Signal).init(pos);
    expect(signal.getSignal()).equals(SignalSignal.Red);
  });

  it('sets and gets a SignalSignal', () => {
    const signal = store.create<Signal>(TYPES.Signal).init(pos);
    signal.setSignal(SignalSignal.Green);
    expect(signal.getSignal()).equals(SignalSignal.Green);
  });
});
