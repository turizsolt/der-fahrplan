import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../inversify.config';
import { TYPES } from '../../src/structs/TYPES';
import { Station } from '../../src/structs/Scheduling/Station';
import { Store } from '../../src/structs/Interfaces/Store';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { Circle } from '../../src/structs/Geometry/Circle';
import { Track } from '../../src/structs/Interfaces/Track';
import { Platform } from '../../src/structs/Interfaces/Platform';
import { Side } from '../../src/structs/Interfaces/Side';
chai.use(chaiAlmost());

const TrackFactory = testContainer.get<() => Track>(TYPES.FactoryOfTrack);
const PlatformFactory = testContainer.get<() => Platform>(
  TYPES.FactoryOfPlatform
);
const StationFactory = testContainer.get<() => Station>(TYPES.FactoryOfStation);
const StoreFactory = testContainer.get<() => Store>(TYPES.FactoryOfStore);

const store = StoreFactory();

describe('Station', () => {
  beforeEach(() => {
    store.clear();
  });

  it('creates a new station at nowhere', () => {
    const station = StationFactory().init(
      new Circle(new Coordinate(0, 0, 0), 20)
    );

    expect(station.getPlatforms()).deep.equals([]);
    expect(station.getColor()).not.equals(null);
    expect(station.getRenderer()).not.equals(null);
  });

  it('creates a new station at a platform', () => {
    const track = TrackFactory().init([
      new Coordinate(-100, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const platform = PlatformFactory().init(track, 0, 1, Side.Left);

    const station = StationFactory().init(
      new Circle(new Coordinate(0, 0, 0), 20)
    );

    expect(station.getPlatforms()).deep.equals([platform]);
    expect(platform.getStation()).equals(station);
  });

  it('creates a new platform at a station', () => {
    const station = StationFactory().init(
      new Circle(new Coordinate(0, 0, 0), 20)
    );

    const track = TrackFactory().init([
      new Coordinate(-100, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const platform = PlatformFactory().init(track, 0, 1, Side.Left);

    expect(station.getPlatforms()).deep.equals([platform]);
    expect(platform.getStation()).equals(station);
  });

  it('creates a new station nowhere, and a separate platform', () => {
    const track = TrackFactory().init([
      new Coordinate(-100, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const platform = PlatformFactory().init(track, 0, 0.5, Side.Left);

    const station = StationFactory().init(
      new Circle(new Coordinate(50, 0, 0), 20)
    );

    expect(station.getPlatforms()).deep.equals([]);
  });

  it('only the first station gets the platform', () => {
    const track = TrackFactory().init([
      new Coordinate(-100, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const platform = PlatformFactory().init(track, 0, 1, Side.Left);

    const station = StationFactory().init(
      new Circle(new Coordinate(0, 0, 0), 20)
    );

    const station2 = StationFactory().init(
      new Circle(new Coordinate(20, 0, 0), 40)
    );

    expect(station.getPlatforms()).deep.equals([platform]);
    expect(station2.getPlatforms()).deep.equals([]);
    expect(platform.getStation()).equals(station);
  });

  it('removes a platform', () => {
    const track = TrackFactory().init([
      new Coordinate(-100, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const platform = PlatformFactory().init(track, 0, 1, Side.Left);

    const station = StationFactory().init(
      new Circle(new Coordinate(0, 0, 0), 20)
    );

    expect(station.getPlatforms()).deep.equals([platform]);
    expect(platform.getStation()).equals(station);
    expect(platform.isRemoved()).equals(false);

    platform.remove();

    expect(platform.isRemoved()).equals(true);
    expect(station.getPlatforms()).deep.equals([]);
  });

  it('removes a station', () => {
    const track = TrackFactory().init([
      new Coordinate(-100, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const platform = PlatformFactory().init(track, 0, 1, Side.Left);

    const station = StationFactory().init(
      new Circle(new Coordinate(0, 0, 0), 20)
    );

    expect(station.getPlatforms()).deep.equals([platform]);
    expect(platform.getStation()).equals(station);
    expect(station.isRemoved()).equals(false);

    station.remove();

    expect(platform.getStation()).equals(null);
    expect(station.isRemoved()).equals(true);
  });
});
