import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { getTestStore } from '../../getTestStore';
import { Signal } from '../../../src/modules/Signaling/Signal';
import { TYPES } from '../../../src/di/TYPES';
import { SignalSignal } from '../../../src/modules/Signaling/SignalSignal';
chai.use(chaiAlmost());

const store = getTestStore();

describe('Signal', () => {
  it('gets a SignalSignal', () => {
    const signal = store.create<Signal>(TYPES.Signal).init();
    expect(signal.getSignal()).equals(SignalSignal.Red);
  });

  it('sets and gets a SignalSignal', () => {
    const signal = store.create<Signal>(TYPES.Signal).init();
    signal.setSignal(SignalSignal.Green);
    expect(signal.getSignal()).equals(SignalSignal.Green);
  });
});
