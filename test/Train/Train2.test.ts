import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { ActualTrain2 } from '../../src/modules/Train/ActualTrain2';
import { PositionOnTrack2 } from '../../src/modules/Train/PositionOnTrack2';
import { createTrack } from '../Track/util';
import { TrackDirection } from '../../src/modules/Track/TrackDirection';
import { getTestStore } from '../getTestStore';
import { Wagon } from '../../src/structs/Interfaces/Wagon';
import { TYPES } from '../../src/di/TYPES';
chai.use(chaiAlmost());

const store = getTestStore();

describe('Train2', () => {
  it('create a Train2', () => {
    const { track } = createTrack();
    const wagon = store.create<Wagon>(TYPES.Wagon);
    const pot = new PositionOnTrack2(track, 0, TrackDirection.AB);
    const train = new ActualTrain2().init(pot, [wagon]);
    expect(train).not.equals(null);
  });
});
