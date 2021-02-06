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

xdescribe('Arrive then depart', () => {
  const stationA = StationFactory().initX();
  const platformA1 = PlatformFactory().initX(stationA, '1');

  const stationB = StationFactory().initX();
  const platformB2 = PlatformFactory().initX(stationB, '2');

  const stationC = StationFactory().initX();
  const platformC3 = PlatformFactory().initX(stationC, '3');

  const tripStopA1 = RouteStopFactory().init(stationA, platformA1);
  const tripStopB2 = RouteStopFactory().init(stationB, platformB2);
  const tripStopC3 = RouteStopFactory().init(stationC, platformC3);

  const routeAC: Route = RouteFactory().init();
  routeAC.addStop(tripStopA1);
  routeAC.addStop(tripStopB2);
  routeAC.addStop(tripStopC3);

  it('should unboard first, then board', () => {
    const wagon = WagonFactory().init();
    wagon.setSeatCount(1, 1);
    // wagon.assignTrip(routeAC);
    const passenger1 = PassengerFactory().init(stationA, stationB);
    const passenger2 = PassengerFactory().init(stationB, stationC);

    wagon.stoppedAt(platformA1);
    wagon.stoppedAt(platformB2);

    expect(passenger1.getPlace()).equals(null);
    expect(passenger2.getPlace().getId()).equals(wagon.getId());
  });
});
