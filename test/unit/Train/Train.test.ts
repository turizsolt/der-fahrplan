import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { PositionOnTrack } from '../../../src/modules/Train/PositionOnTrack';
import { createTrack } from '../Track/util';
import { TrackDirection } from '../../../src/modules/Track/TrackDirection';
import { getTestStore } from '../../getTestStore';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { TYPES } from '../../../src/di/TYPES';
import { WhichEnd } from '../../../src/structs/Interfaces/WhichEnd';
import { Train } from '../../../src/modules/Train/Train';
import { getPredefinedWagonConfig } from '../../../src/structs/Actuals/Wagon/ActualWagonConfigs';
chai.use(chaiAlmost());

const store = getTestStore();
const wagonConfig = getPredefinedWagonConfig('wagon');
const createWagon = () => store.create<Wagon>(TYPES.Wagon).init(wagonConfig);

describe('Train', () => {
  it('create a Train and get basic props', () => {
    const { track } = createTrack(100);
    const wagon = createWagon();
    const pot = PositionOnTrack.fromTrack(track, 100, TrackDirection.AB);
    const train = store.create<Train>(TYPES.Train).init(pot, [wagon]);
    expect(train).not.equals(null);
    expect(train.getPosition()).equals(pot);
    expect(train.getWagons()).deep.equals([wagon]);
  });

  it('add wagons to train', () => {
    const { track } = createTrack(100);
    const wagon = createWagon();
    const wagon2 = createWagon();
    const pot = PositionOnTrack.fromTrack(track, 100, TrackDirection.AB);
    const train = store.create<Train>(TYPES.Train).init(pot, [wagon]);
    train.addWagons([wagon2]);
    expect(train.getWagons()).deep.equals([wagon, wagon2]);
  });

  it('merge two trains', () => {
    const { track } = createTrack(100);
    const wagon = createWagon();
    const wagon2 = createWagon();
    const pot = PositionOnTrack.fromTrack(track, 100, TrackDirection.AB);
    const pot2 = PositionOnTrack.fromTrack(track, 85, TrackDirection.AB);
    const train = store.create<Train>(TYPES.Train).init(pot, [wagon]);
    const train2 = store.create<Train>(TYPES.Train).init(pot2, [wagon2]);
    train.merge(train2);
    expect(train).not.equals(null);
    expect(store.get(train2.getId())).equals(undefined);
    expect(train.getWagons()).deep.equals([wagon, wagon2]);
  });

  it('separate a train into two', () => {
    const { track } = createTrack(100);
    const pot = PositionOnTrack.fromTrack(track, 100, TrackDirection.AB);
    const wagon = createWagon();
    const wagon2 = createWagon();
    const train = store.create<Train>(TYPES.Train).init(pot, [wagon, wagon2]);
    const train2 = train.separate(wagon2);
    expect(train.getWagons()).deep.equals([wagon]);
    expect(train2.getWagons()).deep.equals([wagon2]);
  });

  it('separate a train into two, but wagon is not present', () => {
    const { track } = createTrack(100);
    const pot = PositionOnTrack.fromTrack(track, 100, TrackDirection.AB);
    const wagon = createWagon();
    const wagon2 = createWagon();
    const wagon3 = createWagon();
    const train = store.create<Train>(TYPES.Train).init(pot, [wagon, wagon2]);
    const train2 = train.separate(wagon3);
    expect(train.getWagons()).deep.equals([wagon, wagon2]);
    expect(train2.getWagons()).deep.equals([]);
  });

  it('reverse a train', () => {
    const { track } = createTrack(100);
    const pot = PositionOnTrack.fromTrack(track, 100, TrackDirection.AB);
    const wagon = createWagon();
    const wagon2 = createWagon();

    const train = store.create<Train>(TYPES.Train).init(pot, [wagon, wagon2]);
    const endPot = wagon2.getAxlePosition(WhichEnd.B);

    train.reverse();
    expect(train.getPosition()).equals(endPot);
    expect(train.getWagons()).deep.equals([wagon2, wagon]);
  });

  it('reverse a train twice', () => {
    const { track } = createTrack(100);
    const pot = PositionOnTrack.fromTrack(track, 100, TrackDirection.AB);
    const wagon = createWagon();
    const wagon2 = createWagon();

    const train = store.create<Train>(TYPES.Train).init(pot, [wagon, wagon2]);
    const endPot = wagon.getAxlePosition(WhichEnd.A);

    train.reverse();
    train.reverse();
    expect(train.getPosition()).equals(endPot);
    expect(train.getWagons()).deep.equals([wagon, wagon2]);
  });

  it('train put it.s wagons to position', () => {
    const { track } = createTrack(100);
    const pot = PositionOnTrack.fromTrack(track, 100, TrackDirection.AB);
    const wagon = createWagon();
    const wagon2 = createWagon();
    const wagon3 = createWagon();
    store.create<Train>(TYPES.Train).init(pot, [wagon, wagon2, wagon3]);
    expect(wagon.getAxlePosition(WhichEnd.A).getPosition()).equals(100);
    expect(wagon.getAxlePosition(WhichEnd.B).getPosition()).equals(86);
    expect(wagon2.getAxlePosition(WhichEnd.A).getPosition()).equals(85);
    expect(wagon2.getAxlePosition(WhichEnd.B).getPosition()).equals(71);
    expect(wagon3.getAxlePosition(WhichEnd.A).getPosition()).equals(70);
    expect(wagon3.getAxlePosition(WhichEnd.B).getPosition()).equals(56);
  });
});
