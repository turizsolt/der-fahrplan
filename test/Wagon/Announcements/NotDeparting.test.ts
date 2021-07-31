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

xdescribe('Departing only forward stations', () => {
  const stationA = StationFactory().initX();
  const platformA1 = PlatformFactory().initX(stationA, '1');

  const stationB = StationFactory().initX();
  const platformB2 = PlatformFactory().initX(stationB, '2');

  const stationC = StationFactory().initX();
  const platformC3 = PlatformFactory().initX(stationC, '3');

  const tripStopA1 = RouteStopFactory().init(stationA, platformA1);
  const tripStopB2 = RouteStopFactory().init(stationB, platformB2);
  const tripStopC3 = RouteStopFactory().init(stationC, platformC3);

  const route: Route = RouteFactory().init();
  route.addWaypoint(tripStopA1);
  route.addWaypoint(tripStopB2);
  route.addWaypoint(tripStopC3);

  it('only board, when destination is after the current stop', () => {
    const passengerToA = PassengerFactory().init(stationB, stationA);
    const passengerToC = PassengerFactory().init(stationB, stationC);
    const wagon = WagonFactory().init();
    // wagon.assignTrip(route);

    wagon.stoppedAt(platformA1);
    wagon.stoppedAt(platformB2);

    expect(passengerToA.getPlace()).equals(stationB);
    expect(passengerToC.getPlace()).equals(wagon);
  });
});
