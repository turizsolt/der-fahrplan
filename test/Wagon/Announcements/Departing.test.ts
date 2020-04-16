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

  const tripStopA1 = RouteStopFactory().init(stationA, platformA1);
  const tripStopA = RouteStopFactory().init(stationA, null);
  const tripStopB2 = RouteStopFactory().init(stationB, platformB2);

  const trip: Trip = RouteFactory().init();
  trip.addStop(tripStopA1);
  trip.addStop(tripStopB2);

  const trip2: Trip = RouteFactory().init();
  trip2.addStop(tripStopA);
  trip2.addStop(tripStopB2);

  it('train stops with trip, on known platform', () => {
    const passenger = PassengerFactory().init(stationA, stationB);
    const wagon = WagonFactory().init();
    wagon.assignTrip(trip);
    wagon.stoppedAt(platformA1);

    expect(passenger.getPlace()).equals(wagon);
  });

  it('train stops with trip, on unknown platform', () => {
    const passenger = PassengerFactory().init(stationA, stationB);
    const wagon = WagonFactory().init();
    wagon.assignTrip(trip2);
    wagon.stoppedAt(platformA1);

    expect(passenger.getPlace()).equals(wagon);
  });

  it('train stops without trip (passenger not getting on)', () => {
    const passenger = PassengerFactory().init(stationA, stationB);
    const wagon = WagonFactory().init();
    wagon.stoppedAt(platformA1);

    expect(passenger.getPlace()).equals(stationA);
  });

  it('train stops with trip, on known platform, passenger created afterwards', () => {
    const wagon = WagonFactory().init();
    wagon.assignTrip(trip);
    const passenger = PassengerFactory().init(stationA, stationB);
    expect(passenger.getPlace()).equals(platformA1);

    wagon.stoppedAt(platformA1);

    expect(passenger.getPlace()).equals(wagon);
  });
});
