import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../src/di/test.config';
import { TYPES } from '../../src/di/TYPES';
import { Route } from '../../src/structs/Scheduling/Route';
import { Store } from '../../src/structs/Interfaces/Store';
import { Trip } from '../../src/structs/Scheduling/Trip';
import { RouteStop } from '../../src/structs/Scheduling/RouteStop';
import { Station } from '../../src/structs/Scheduling/Station';
chai.use(chaiAlmost());

export const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
store.clear();
const RouteFactory: () => Route = () => store.create<Route>(TYPES.Route);
const RouteStopFactory: () => RouteStop = () =>
  store.create<RouteStop>(TYPES.RouteStop);
const StationFactory: () => Station = () =>
  store.create<Station>(TYPES.Station);
const TripFactory: () => Trip = () => store.create<Trip>(TYPES.Trip);

describe('Trips', () => {
  const route = RouteFactory().init();
  route.setName('S12');

  const station0 = StationFactory().init(null);
  station0.setName('Alpha');
  const stop0 = RouteStopFactory().init(station0);

  const station1 = StationFactory().init(null);
  station1.setName('Bravo');
  const stop1 = RouteStopFactory().init(station1);

  const station2 = StationFactory().init(null);
  station2.setName('Charlie');
  const stop2 = RouteStopFactory().init(station2);

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
});
