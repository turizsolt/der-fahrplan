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
import { Passenger } from '../../src/structs/Interfaces/Passenger';
import { Wagon } from '../../src/structs/Interfaces/Wagon';
import { Route } from '../../src/structs/Scheduling/Route';
import { RouteStop } from '../../src/structs/Scheduling/RouteStop';
chai.use(chaiAlmost());

const TrackFactory = testContainer.get<() => Track>(TYPES.FactoryOfTrack);
const PlatformFactory = testContainer.get<() => Platform>(
  TYPES.FactoryOfPlatform
);
const StationFactory = testContainer.get<() => Station>(TYPES.FactoryOfStation);
const StoreFactory = testContainer.get<() => Store>(TYPES.FactoryOfStore);

const store = StoreFactory();

describe('Passenger', () => {
  let track: Track,
    platform1: Platform,
    platform2: Platform,
    station1: Station,
    station2: Station,
    wagon: Wagon,
    route: Route;
  before(() => {
    store.clear();

    track = TrackFactory().init([
      new Coordinate(-100, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    platform1 = PlatformFactory().init(track, 0.2, 0.4, Side.Left);
    station1 = StationFactory().init(new Circle(new Coordinate(-60, 0, 0), 20));

    platform2 = PlatformFactory().init(track, 0.6, 0.8, Side.Right);
    station2 = StationFactory().init(new Circle(new Coordinate(60, 0, 0), 20));

    wagon = store.create<Wagon>(TYPES.Wagon).init();
    wagon.putOnTrack(track, 0);

    route = store.create<Route>(TYPES.Route).init();
    const stop1 = store.create<RouteStop>(TYPES.RouteStop);
    stop1.init(station1, platform1);
    route.addStop(stop1);

    const stop2 = store.create<RouteStop>(TYPES.RouteStop);
    stop2.init(station2, platform2);
    route.addStop(stop2);
  });

  beforeEach(() => {});

  it('creates a new passenger at a station', () => {
    const passenger = store.create<Passenger>(TYPES.Passenger);
    passenger.init(station1, station2);

    expect(passenger.getPlace()).equals(station1);

    // 'goes to the platform when the train announced'
    wagon.assignTrip(route);
    expect(passenger.getPlace()).equals(platform1);

    // 'train stops at platform'
    wagon.moveTowardsWagonB(40);
    wagon.stoppedAt(platform1);
    expect(passenger.getPlace()).equals(wagon);

    // 'train stops at platform'
    wagon.moveTowardsWagonB(80);
    wagon.stoppedAt(platform2);
    expect(passenger.getPlace()).equals(null);
  });
});
