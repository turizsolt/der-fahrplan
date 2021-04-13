import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { getTestStore } from '../../getTestStore';
import { Signal } from '../../../src/modules/Signaling/Signal';
import { TYPES } from '../../../src/di/TYPES';
chai.use(chaiAlmost());

const store = getTestStore();

describe('Signal', () => {
  it('create a Signal', () => {
    const signal = store.create<Signal>(TYPES.Signal);
    signal.init();
  });
});
