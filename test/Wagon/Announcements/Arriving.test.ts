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
import { Trip } from '../../../src/structs/Scheduling/Trip';
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

describe('Announcing departing trains', () => {
  const stationA = StationFactory().initX();
  const platformA1 = PlatformFactory().initX(stationA, '1');

  const stationB = StationFactory().initX();
  const platformB2 = PlatformFactory().initX(stationB, '2');

  const stationC = StationFactory().initX();
  const platformC3 = PlatformFactory().initX(stationC, '3');

  const tripStopA1 = RouteStopFactory().init(stationA, platformA1);
  const tripStopB2 = RouteStopFactory().init(stationB, platformB2);
  const tripStopC3 = RouteStopFactory().init(stationC, platformC3);

  const tripAB: Trip = RouteFactory().init();
  tripAB.addStop(tripStopA1);
  tripAB.addStop(tripStopB2);

  const tripAC: Trip = RouteFactory().init();
  tripAC.addStop(tripStopA1);
  tripAC.addStop(tripStopB2);
  tripAC.addStop(tripStopC3);

  it('train stops where passenger goes to', () => {
    const passenger = PassengerFactory().init(stationA, stationB);
    const wagon = WagonFactory().init();
    wagon.assignTrip(tripAB);
    wagon.stoppedAt(platformA1);
    wagon.stoppedAt(platformB2);

    expect(passenger.getPlace()).equals(null);
  });

  it('train stops where passenger goes to', () => {
    const passenger = PassengerFactory().init(stationA, stationC);
    const wagon = WagonFactory().init();
    wagon.assignTrip(tripAC);
    wagon.stoppedAt(platformA1);
    wagon.stoppedAt(platformB2);

    expect(passenger.getPlace()).equals(wagon);
  });

  it('train stops, get off because no trip assigned', () => {
    const passenger = PassengerFactory().init(stationA, stationC);
    const wagon = WagonFactory().init();
    wagon.assignTrip(tripAC);
    wagon.stoppedAt(platformA1);
    wagon.assignTrip(null);
    wagon.stoppedAt(platformB2);

    expect(passenger.getPlace()).equals(stationB);
  });

  it('train stops, get off because trip is not mine anymore', () => {
    const passenger = PassengerFactory().init(stationA, stationC);
    const wagon = WagonFactory().init();
    wagon.assignTrip(tripAC);
    wagon.stoppedAt(platformA1);
    wagon.assignTrip(tripAB);
    wagon.stoppedAt(platformB2);

    expect(passenger.getPlace()).equals(stationB);
  });
});
