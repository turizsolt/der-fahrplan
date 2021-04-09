import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { PositionOnTrack } from '../../../src/modules/Train/PositionOnTrack';
import { createTrack, createTrackLine } from '../Track/util';
import { TrackDirection } from '../../../src/modules/Track/TrackDirection';
import { Nearest } from '../../../src/modules/Train/Nearest';
import { getTestStore } from '../../getTestStore';
import { TYPES } from '../../../src/di/TYPES';
import { Train } from '../../../src/modules/Train/Train';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { getPredefinedWagonConfig } from '../../../src/structs/Actuals/Wagon/ActualWagonConfigs';
chai.use(chaiAlmost());

const store = getTestStore();

describe('Nearest', () => {
  it('nearest end is here', () => {
    const { track } = createTrack(100);
    const pot = new PositionOnTrack(track, 100, TrackDirection.AB);
    expect(Nearest.find(pot).end).deep.equals({
      distance: 0,
      segmentCount: 1
    });
  });

  it('nearest end is inside the track', () => {
    const { track } = createTrack(100);
    const pot = new PositionOnTrack(track, 80, TrackDirection.AB);
    expect(Nearest.find(pot).end).deep.equals({
      distance: 20,
      segmentCount: 1
    });
  });

  it('nearest end is far away', () => {
    const {
      track: [track1]
    } = createTrackLine(4, 100);
    const pot = new PositionOnTrack(track1, 80, TrackDirection.AB);
    expect(Nearest.find(pot).end).deep.equals({
      distance: 220,
      segmentCount: 3
    });
  });

  it('no nearest train', () => {
    const { track } = createTrack(100);
    const pot = new PositionOnTrack(track, 20, TrackDirection.AB);
    expect(Nearest.find(pot).train).deep.equals({
      distance: Number.POSITIVE_INFINITY,
      segmentCount: 1,
      train: null
    });
  });

  it('nearest train is inside the track', () => {
    const { track } = createTrack(100);
    const pot = new PositionOnTrack(track, 20, TrackDirection.AB);
    const potTrain = new PositionOnTrack(track, 60, TrackDirection.AB);
    const train = store.create<Train>(TYPES.Train);
    const wagon = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'), train);
    train.init(potTrain, [wagon]);
    expect(Nearest.find(pot).train).deep.equals({
      distance: 26,
      segmentCount: 1,
      train
    });
  });

  it('nearest train is behind us, inside the track', () => {
    const { track } = createTrack(100);
    const pot = new PositionOnTrack(track, 60, TrackDirection.AB);
    const potTrain = new PositionOnTrack(track, 20, TrackDirection.AB);
    const train = store.create<Train>(TYPES.Train);
    const wagon = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'), train);
    train.init(potTrain, [wagon]);
    expect(Nearest.find(pot).train).deep.equals({
      distance: Number.POSITIVE_INFINITY,
      segmentCount: 1,
      train: null
    });
  });

  it('nearest train is few tracks ahead, multiple train on that track', () => {
    const {
      track: [track1, track2, track3]
    } = createTrackLine(5, 100);
    const pot = new PositionOnTrack(track1, 20, TrackDirection.AB);
    const potTrain = new PositionOnTrack(track3, 20, TrackDirection.AB);
    const train = store.create<Train>(TYPES.Train);
    const wagon = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'), train);
    train.init(potTrain, [wagon]);

    const potTrain2 = new PositionOnTrack(track3, 60, TrackDirection.AB);
    const train2 = store.create<Train>(TYPES.Train);
    const wagon2 = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'), train2);
    train2.init(potTrain2, [wagon2]);

    expect(Nearest.find(pot).train).deep.equals({
      distance: 186,
      segmentCount: 3,
      train
    });
  });
});
