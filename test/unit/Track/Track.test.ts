import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { getTestStore } from '../../getTestStore';
import { createTrack } from './util';
chai.use(chaiAlmost());

const store = getTestStore();

describe('Track', () => {
  it('create a track', () => {
    const { track } = createTrack();
  });
});
