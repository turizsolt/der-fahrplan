import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { TYPES } from '../../src/di/TYPES';
import { Track } from '../../src/modules/Track/Track';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { getTestStore } from '../getTestStore';
chai.use(chaiAlmost());

const store = getTestStore();

describe('Track', () => {
  it('create a track', () => {
    const track = store
      .create<Track>(TYPES.Track)
      .init([new Coordinate(0, 0, 0), new Coordinate(0, 0, 100)]);
  });
});
