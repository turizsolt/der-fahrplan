import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../src/di/test.config';
import { TYPES } from '../../src/di/TYPES';
import { Route } from '../../src/structs/Scheduling/Route';
import { Store } from '../../src/structs/Interfaces/Store';
import { Trip } from '../../src/structs/Scheduling/Trip';
import { RouteStop } from '../../src/structs/Scheduling/RouteStop';
import { Station } from '../../src/structs/Scheduling/Station';
import { Platform } from '../../src/structs/Interfaces/Platform';
chai.use(chaiAlmost());

export const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
store.clear();
const RouteFactory: () => Route = () => store.create<Route>(TYPES.Route);
const RouteStopFactory: () => RouteStop = () =>
  store.create<RouteStop>(TYPES.RouteStop);
const PlatformFactory: () => Platform = () =>
  store.create<Platform>(TYPES.Platform);
const StationFactory: () => Station = () =>
  store.create<Station>(TYPES.Station);
const TripFactory: () => Trip = () => store.create<Trip>(TYPES.Trip);

describe('Trips', () => {
  const route = RouteFactory().init();
  route.setName('S12');

  const station0 = StationFactory().init(null);
  const station1 = StationFactory().init(null);
  const station2 = StationFactory().init(null);
  station0.setName('Alpha');
  station1.setName('Bravo');
  station2.setName('Charlie');

  const platform0A = PlatformFactory().initX(station0, 'A');
  const stop0 = RouteStopFactory().init(station0, platform0A, undefined, 0);

  const platform1B = PlatformFactory().initX(station1, 'B');
  const platform1C = PlatformFactory().initX(station1, 'C');
  const stop1 = RouteStopFactory().init(station1, platform1B, 3, 4);

  const stop2 = RouteStopFactory().init(station2, null);

  route.addStop(stop0);
  route.addStop(stop1);

  it('creates a new trip from route', () => {
    const trip = TripFactory().init(route, 0);

    expect(trip.getRoute().getId()).equals(route.getId());
  });

  it('copies the stops from route', () => {
    const trip = TripFactory().init(route, 0);

    expect(trip.getStops().map(x => x.stationName)).deep.equals([
      'Alpha',
      'Bravo'
    ]);
  });

  it('stops changes when changes on route', () => {
    const trip = TripFactory().init(route, 0);
    route.addStop(stop2);

    expect(trip.getStops().map(x => x.stationName)).deep.equals([
      'Alpha',
      'Bravo',
      'Charlie'
    ]);

    route.removeStop(stop2);
  });

  it('arrival and departure times read correctly', () => {
    const trip = TripFactory().init(route, 10);

    expect(trip.getStops().map(x => x.arrivalTime)).deep.equals([10, 13]);
    expect(trip.getStops().map(x => x.departureTime)).deep.equals([10, 14]);
  });

  it('redefined arrival and departure times read correctly', () => {
    const trip = TripFactory().init(route, 10);
    trip.redefine(stop1, { arrivalTime: 15, departureTime: 16 });

    expect(trip.getStops().map(x => x.arrivalTime)).deep.equals([10, 15]);
    expect(trip.getStops().map(x => x.departureTime)).deep.equals([10, 16]);
  });

  it('platforms read correctly', () => {
    const trip = TripFactory().init(route, 10);

    expect(trip.getStops().map(x => x.platformNo)).deep.equals(['A', 'B']);
  });

  it('redefined platform read correctly', () => {
    const trip = TripFactory().init(route, 10);
    trip.redefine(stop1, { platform: platform1C });

    expect(trip.getStops().map(x => x.platformNo)).deep.equals(['A', 'C']);
  });
});
