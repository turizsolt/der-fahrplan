import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { ActualTrain2 } from '../../../src/modules/Train/ActualTrain2';
import { PositionOnTrack } from '../../../src/modules/Train/PositionOnTrack';
import { createTrack } from '../Track/util';
import { TrackDirection } from '../../../src/modules/Track/TrackDirection';
import { getTestStore } from '../../getTestStore';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { TYPES } from '../../../src/di/TYPES';
import { Track } from '../../../src/modules/Track/Track';
import { WhichEnd } from '../../../src/structs/Interfaces/WhichEnd';
chai.use(chaiAlmost());

const store = getTestStore();

describe('Train2', () => {
  it('create a Train2 and get basic props', () => {
    const { track } = createTrack(100);
    const wagon = store.create<Wagon>(TYPES.Wagon).init();
    const pot = new PositionOnTrack(track, 100, TrackDirection.AB);
    const train = new ActualTrain2().init(pot, [wagon]);
    expect(train).not.equals(null);
    expect(train.getPosition()).equals(pot);
    expect(train.getWagons()).deep.equals([wagon]);
  });

  it('add wagons to train', () => {
    const { track } = createTrack(100);
    const wagon = store.create<Wagon>(TYPES.Wagon).init();
    const wagon2 = store.create<Wagon>(TYPES.Wagon).init();
    const pot = new PositionOnTrack(track, 100, TrackDirection.AB);
    const train = new ActualTrain2().init(pot, [wagon]);
    train.addWagons([wagon2]);
    expect(train.getWagons()).deep.equals([wagon, wagon2]);
  });

  it('merge two trains', () => {
    const { track } = createTrack(100);
    const wagon = store.create<Wagon>(TYPES.Wagon).init();
    const wagon2 = store.create<Wagon>(TYPES.Wagon).init();
    const pot = new PositionOnTrack(track, 100, TrackDirection.AB);
    const pot2 = new PositionOnTrack(track, 85, TrackDirection.AB);
    const train = new ActualTrain2().init(pot, [wagon]);
    const train2 = new ActualTrain2().init(pot2, [wagon2]);
    train.merge(train2);
    expect(train).not.equals(null);
    expect(store.get(train2.getId())).equals(undefined);
    expect(train.getWagons()).deep.equals([wagon, wagon2]);
  });

  it('separate a train into two', () => {
    const { track } = createTrack(100);
    const pot = new PositionOnTrack(track, 100, TrackDirection.AB);
    const wagon = store.create<Wagon>(TYPES.Wagon).init();
    const wagon2 = store.create<Wagon>(TYPES.Wagon).init();
    const train = new ActualTrain2().init(pot, [wagon, wagon2]);
    const train2 = train.separate(wagon2);
    expect(train.getWagons()).deep.equals([wagon]);
    expect(train2.getWagons()).deep.equals([wagon2]);
  });

  it('separate a train into two, but wagon is not present', () => {
    const { track } = createTrack(100);
    const pot = new PositionOnTrack(track, 100, TrackDirection.AB);
    const wagon = store.create<Wagon>(TYPES.Wagon).init();
    const wagon2 = store.create<Wagon>(TYPES.Wagon).init();
    const wagon3 = store.create<Wagon>(TYPES.Wagon).init();
    const train = new ActualTrain2().init(pot, [wagon, wagon2]);
    const train2 = train.separate(wagon3);
    expect(train.getWagons()).deep.equals([wagon, wagon2]);
    expect(train2.getWagons()).deep.equals([]);
  });

  it('reverse a train', () => {
    const { track } = createTrack(100);
    const pot = new PositionOnTrack(track, 100, TrackDirection.AB);
    const wagon = store.create<Wagon>(TYPES.Wagon).init();
    const wagon2 = store.create<Wagon>(TYPES.Wagon).init();

    const train = new ActualTrain2().init(pot, [wagon, wagon2]);
    const endPot = wagon2.getAxlePosition(WhichEnd.B);

    train.reverse();
    expect(train.getPosition()).equals(endPot);
    expect(train.getWagons()).deep.equals([wagon2, wagon]);
  });

  it('reverse a train twice', () => {
    const { track } = createTrack(100);
    const pot = new PositionOnTrack(track, 100, TrackDirection.AB);
    const wagon = store.create<Wagon>(TYPES.Wagon).init();
    const wagon2 = store.create<Wagon>(TYPES.Wagon).init();

    const train = new ActualTrain2().init(pot, [wagon, wagon2]);
    const endPot = wagon.getAxlePosition(WhichEnd.A);

    train.reverse();
    train.reverse();
    expect(train.getPosition()).equals(endPot);
    expect(train.getWagons()).deep.equals([wagon, wagon2]);
  });

  it('train put it.s wagons to position', () => {
    const { track } = createTrack(100);
    const pot = new PositionOnTrack(track, 100, TrackDirection.AB);
    const wagon = store.create<Wagon>(TYPES.Wagon).init();
    const wagon2 = store.create<Wagon>(TYPES.Wagon).init();
    const wagon3 = store.create<Wagon>(TYPES.Wagon).init();
    new ActualTrain2().init(pot, [wagon, wagon2, wagon3]);
    expect(wagon.getAxlePosition(WhichEnd.A).getPosition()).equals(100);
    expect(wagon.getAxlePosition(WhichEnd.B).getPosition()).equals(86);
    expect(wagon2.getAxlePosition(WhichEnd.A).getPosition()).equals(85);
    expect(wagon2.getAxlePosition(WhichEnd.B).getPosition()).equals(71);
    expect(wagon3.getAxlePosition(WhichEnd.A).getPosition()).equals(70);
    expect(wagon3.getAxlePosition(WhichEnd.B).getPosition()).equals(56);
  });
});
