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

// todo train and wagon creator helper needed here

describe('Nearest', () => {
  it('nearest end is here', () => {
    const { track } = createTrack(100);
    const pot = PositionOnTrack.fromTrack(track, 100, TrackDirection.AB);
    expect(Nearest.end(pot)).deep.equals({
      distance: 0,
      segmentCount: 1
    });
  });

  it('nearest end is inside the track', () => {
    const { track } = createTrack(100);
    const pot = PositionOnTrack.fromTrack(track, 80, TrackDirection.AB);
    expect(Nearest.end(pot)).deep.equals({
      distance: 20,
      segmentCount: 1
    });
  });

  it('nearest end is far away', () => {
    const {
      track: [track1]
    } = createTrackLine(4, 100);
    const pot = PositionOnTrack.fromTrack(track1, 80, TrackDirection.AB);
    expect(Nearest.end(pot)).deep.equals({
      distance: 220,
      segmentCount: 3
    });
  });

  it('no nearest train', () => {
    const { track } = createTrack(100);
    const pot = PositionOnTrack.fromTrack(track, 20, TrackDirection.AB);
    expect(Nearest.train(pot)).deep.equals({
      distance: Number.POSITIVE_INFINITY,
      segmentCount: 1,
      train: null
    });
  });

  it('nearest train is inside the track', () => {
    const { track } = createTrack(100);
    const pot = PositionOnTrack.fromTrack(track, 20, TrackDirection.AB);
    const potTrain = PositionOnTrack.fromTrack(track, 60, TrackDirection.AB);
    const train = store.create<Train>(TYPES.Train);
    const wagon = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'), train);
    train.init(potTrain, [wagon]);
    expect(Nearest.train(pot)).deep.equals({
      distance: 26,
      segmentCount: 1,
      train
    });
  });

  it('nearest train is behind us, inside the track', () => {
    const { track } = createTrack(100);
    const pot = PositionOnTrack.fromTrack(track, 60, TrackDirection.AB);
    const potTrain = PositionOnTrack.fromTrack(track, 20, TrackDirection.AB);
    const train = store.create<Train>(TYPES.Train);
    const wagon = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'), train);
    train.init(potTrain, [wagon]);
    expect(Nearest.train(pot)).deep.equals({
      distance: Number.POSITIVE_INFINITY,
      segmentCount: 1,
      train: null
    });
  });

  it('nearest train is few tracks ahead, multiple train on that track', () => {
    const {
      track: [track1, track2, track3]
    } = createTrackLine(5, 100);
    const pot = PositionOnTrack.fromTrack(track1, 20, TrackDirection.AB);
    const potTrain = PositionOnTrack.fromTrack(track3, 20, TrackDirection.AB);
    const train = store.create<Train>(TYPES.Train);
    const wagon = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'), train);
    train.init(potTrain, [wagon]);

    const potTrain2 = PositionOnTrack.fromTrack(track3, 60, TrackDirection.AB);
    const train2 = store.create<Train>(TYPES.Train);
    const wagon2 = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'), train2);
    train2.init(potTrain2, [wagon2]);

    expect(Nearest.train(pot)).deep.equals({
      distance: 186,
      segmentCount: 3,
      train
    });
  });

  it('nearest train is inside the track, but opposite facing', () => {
    const { track } = createTrack(100);
    const pot = PositionOnTrack.fromTrack(track, 0, TrackDirection.AB);
    const potTrain = PositionOnTrack.fromTrack(track, 20, TrackDirection.BA);
    const train = store.create<Train>(TYPES.Train);
    const wagon = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'), train);
    train.init(potTrain, [wagon]);

    expect(Nearest.train(pot)).deep.equals({
      distance: 80,
      segmentCount: 1,
      train
    });
  });

  it('nearest train is inside the track, but opposite facing, wrong number order', () => {
    const { track } = createTrack(100);
    const pot = PositionOnTrack.fromTrack(track, 40, TrackDirection.AB);
    const potTrain = PositionOnTrack.fromTrack(track, 20, TrackDirection.BA);
    const train = store.create<Train>(TYPES.Train);
    const wagon = store
      .create<Wagon>(TYPES.Wagon)
      .init(getPredefinedWagonConfig('wagon'), train);
    train.init(potTrain, [wagon]);

    expect(Nearest.train(pot)).deep.equals({
      distance: 40,
      segmentCount: 1,
      train
    });
  });

  it('nearest end is too far away', () => {
    const {
      track: [track0]
    } = createTrackLine(102, 100);
    const pot = PositionOnTrack.fromTrack(track0, 40, TrackDirection.AB);
    expect(Nearest.end(pot)).deep.equals({
      distance: Number.POSITIVE_INFINITY,
      segmentCount: 100
    });
  });
});
