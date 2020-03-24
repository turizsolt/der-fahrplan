import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../inversify.config';
import { TYPES } from '../../src/structs/TYPES';
import { Route } from '../../src/structs/Scheduling/Route';
import { RouteStop } from '../../src/structs/Scheduling/RouteStop';
import { Station } from '../../src/structs/Scheduling/Station';
import { Store } from '../../src/structs/Interfaces/Store';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { Circle } from '../../src/structs/Geometry/Circle';
import { Track } from '../../src/structs/Interfaces/Track';
import { Platform } from '../../src/structs/Interfaces/Platform';
import { Side } from '../../src/structs/Interfaces/Side';
import { fail } from 'assert';
chai.use(chaiAlmost());

const TrackFactory = testContainer.get<() => Track>(TYPES.FactoryOfTrack);
const PlatformFactory = testContainer.get<() => Platform>(
  TYPES.FactoryOfPlatform
);

const RouteFactory = testContainer.get<() => Route>(TYPES.FactoryOfRoute);
const RouteStopFactory = testContainer.get<() => RouteStop>(
  TYPES.FactoryOfRouteStop
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
  });

  it('creates a new station at a platform', () => {
    const track = TrackFactory().init([
      new Coordinate(-100, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const platform = PlatformFactory().init(
      track,
      0,
      1,
      5,
      Side.Left,
      null,
      null
    );

    const station = StationFactory().init(
      new Circle(new Coordinate(0, 0, 0), 20)
    );

    expect(station.getPlatforms()).deep.equals([platform]);
  });

  it('creates a new station nowhere, and a separate platform', () => {
    const track = TrackFactory().init([
      new Coordinate(-100, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const platform = PlatformFactory().init(
      track,
      0,
      0.5,
      5,
      Side.Left,
      null,
      null
    );

    const station = StationFactory().init(
      new Circle(new Coordinate(50, 0, 0), 20)
    );

    expect(station.getPlatforms()).deep.equals([]);
  });
});
