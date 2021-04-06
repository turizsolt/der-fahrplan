import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { ActualTrain2 } from '../../src/modules/Train/ActualTrain2';
import { PositionOnTrack2 } from '../../src/modules/Train/PositionOnTrack2';
import { createTrack } from '../Track/util';
import { TrackDirection } from '../../src/modules/Track/TrackDirection';
import { getTestStore } from '../getTestStore';
import { Wagon } from '../../src/structs/Interfaces/Wagon';
import { TYPES } from '../../src/di/TYPES';
import { getPredefinedWagonConfig } from '../../src/structs/Actuals/Wagon/ActualWagonConfigs';
import { Track } from '../../src/modules/Track/Track';
chai.use(chaiAlmost());

const store = getTestStore();

describe('Train2', () => {
  it('create a Train2 and get basic props', () => {
    const { track } = createTrack();
    const wagon = store.create<Wagon>(TYPES.Wagon);
    const pot = new PositionOnTrack2(track, 0, TrackDirection.AB);
    const train = new ActualTrain2().init(pot, [wagon]);
    expect(train).not.equals(null);
    expect(train.getPosition()).equals(pot);
    expect(train.getWagons()).deep.equals([wagon]);
  });

  it('add wagons to train', () => {
    const { track } = createTrack();
    const wagon = store.create<Wagon>(TYPES.Wagon);
    const wagon2 = store.create<Wagon>(TYPES.Wagon);
    const pot = new PositionOnTrack2(track, 0, TrackDirection.AB);
    const train = new ActualTrain2().init(pot, [wagon]);
    train.addWagons([wagon2]);
    expect(train.getWagons()).deep.equals([wagon, wagon2]);
  });

  it('merge two trains', () => {
    const { track } = createTrack();
    const wagon = store.create<Wagon>(TYPES.Wagon);
    const wagon2 = store.create<Wagon>(TYPES.Wagon);
    const pot = new PositionOnTrack2(track, 0, TrackDirection.AB);
    const pot2 = new PositionOnTrack2(track, 40, TrackDirection.AB);
    const train = new ActualTrain2().init(pot, [wagon]);
    const train2 = new ActualTrain2().init(pot2, [wagon2]);
    train.merge(train2);
    expect(train).not.equals(null);
    expect(store.get(train2.getId())).equals(undefined);
    expect(train.getWagons()).deep.equals([wagon, wagon2]);
  });

  it('separate a train into two', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, TrackDirection.AB);
    const pot2 = new PositionOnTrack2(track, 40, TrackDirection.AB);
    const wagon = store.create<Wagon>(TYPES.Wagon);
    // todo mock it out
    const wagon2 = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'));
    wagon2.putOnTrack(pot2.getTrack() as Track, pot2.getPosition(), 1);
    const train = new ActualTrain2().init(pot, [wagon, wagon2]);
    const train2 = train.separate(wagon2);
    expect(train.getWagons()).deep.equals([wagon]);
    expect(train2.getWagons()).deep.equals([wagon2]);
  });

  it('separate a train into two, but wagon is not present', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, TrackDirection.AB);
    const pot2 = new PositionOnTrack2(track, 40, TrackDirection.AB);
    const wagon = store.create<Wagon>(TYPES.Wagon);
    const wagon2 = store.create<Wagon>(TYPES.Wagon);
    const wagon3 = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'));
    wagon3.putOnTrack(pot2.getTrack() as Track, pot2.getPosition(), -1);

    const train = new ActualTrain2().init(pot, [wagon, wagon2]);
    const train2 = train.separate(wagon3);
    expect(train.getWagons()).deep.equals([wagon, wagon2]);
    expect(train2.getWagons()).deep.equals([]);
  });

  it('reverse a train', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, TrackDirection.AB);
    const wagon = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'));
    wagon.putOnTrack(pot.getTrack() as Track, pot.getPosition(), 1);
    const wagon2 = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'));
    wagon2.putOnTrack(pot.getTrack() as Track, pot.getPosition(), 1);

    const train = new ActualTrain2().init(pot, [wagon, wagon2]);
    train.reverse();
    // expect(train.getPosition()).deep.equals(wagon2.getB());
    expect(train.getWagons()).deep.equals([wagon2, wagon]);
  });

  it('reverse a train twice', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, TrackDirection.AB);
    const wagon = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'));
    wagon.putOnTrack(pot.getTrack() as Track, pot.getPosition(), 1);
    const wagon2 = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'));
    wagon2.putOnTrack(pot.getTrack() as Track, pot.getPosition(), 1);

    const train = new ActualTrain2().init(pot, [wagon, wagon2]);
    train.reverse();
    train.reverse();
    // expect(train.getPosition()).deep.equals(wagon.getA());
    expect(train.getWagons()).deep.equals([wagon, wagon2]);
  });
});
