import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../../src/di/test.config';
import { TYPES } from '../../../src/di/TYPES';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { Store } from '../../../src/structs/Interfaces/Store';
import { Station } from '../../../src/structs/Scheduling/Station';
import { Platform } from '../../../src/structs/Interfaces/Platform';
import { Route } from '../../../src/structs/Scheduling/Route';
import { RouteStop } from '../../../src/structs/Scheduling/RouteStop';
import { Passenger } from '../../../src/structs/Interfaces/Passenger';
chai.use(chaiAlmost());

const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
const WagonFactory = () => store.create<Wagon>(TYPES.Wagon);
const StationFactory = () => store.create<Station>(TYPES.Station);
const PlatformFactory = () => store.create<Platform>(TYPES.Platform);
const RouteFactory = () => store.create<Route>(TYPES.Route);
const RouteStopFactory = () => store.create<RouteStop>(TYPES.RouteStop);
const PassengerFactory = () => store.create<Passenger>(TYPES.Passenger);

xdescribe('Announcing train trips to stations', () => {
  const stationA = StationFactory().initX();
  const platformA1 = PlatformFactory().initX(stationA, '1');
  const platformA3 = PlatformFactory().initX(stationA, '3');

  const stationB = StationFactory().initX();
  const platformB2 = PlatformFactory().initX(stationB, '2');

  const wagon = WagonFactory().init();

  const tripStopA1 = RouteStopFactory().init(stationA, platformA1);
  const tripStopA3 = RouteStopFactory().init(stationA, platformA3);
  const tripStopB2 = RouteStopFactory().init(stationB, platformB2);

  const route: Route = RouteFactory().init();
  route.addWaypoint(tripStopA1);
  route.addWaypoint(tripStopB2);

  const route2: Route = RouteFactory().init();
  route2.addWaypoint(tripStopA3);
  route2.addWaypoint(tripStopB2);

  const passenger = PassengerFactory().init(stationA, stationB);

  step('passenger at station', () => {
    expect(passenger.getPlace()).equals(stationA);
  });

  step('train assigns a trip, stations get it', () => {
    expect(stationA.getPlatformTo(stationB)).equals(undefined);
    expect(stationA.getAnnouncedTrips()).deep.equals([]);

    // wagon.assignTrip(route);

    expect(stationA.getPlatformTo(stationB)).equals(platformA1);
    expect(stationA.getAnnouncedTrips()).deep.equals([route]);
  });

  step('passenger at platformA1', () => {
    expect(passenger.getPlace()).equals(platformA1);
  });

  step('train reassigns a trip, stations get it', () => {
    // wagon.assignTrip(route2);

    expect(stationA.getPlatformTo(stationB)).equals(platformA3);
    expect(stationA.getAnnouncedTrips()).deep.equals([route2]);
  });

  step('passenger at platformA3', () => {
    expect(passenger.getPlace()).equals(platformA3);
  });

  step('train cancels a trip, stations get it', () => {
    wagon.assignTrip(null);

    expect(stationA.getPlatformTo(stationB)).equals(undefined);
    expect(stationA.getAnnouncedTrips()).deep.equals([]);
  });

  step('passenger at station', () => {
    expect(passenger.getPlace()).equals(stationA);
  });
});
