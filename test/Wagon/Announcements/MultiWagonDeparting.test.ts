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
import { createConnectedWagons } from '../Train/GetTrip.test';
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

describe('MultiWagon departing', () => {
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

  it('single wagon, some passenger left at station', () => {
    const passenger: Passenger[] = [];
    const wagon = WagonFactory().init();
    wagon.setSeatCount(2, 2);
    wagon.assignTrip(trip);

    for (let i = 0; i < 3; i++) {
      passenger[i] = PassengerFactory().init(stationA, stationB);
    }

    wagon.stoppedAt(platformA1);

    expect(passenger[0].getPlace()).equals(wagon);
    expect(passenger[1].getPlace()).equals(wagon);
    expect(passenger[2].getPlace()).equals(platformA1);
  });

  it('two wagons, put everybody into the same', () => {
    const passenger: Passenger[] = [];
    const [wagon1, wagon2] = createConnectedWagons(2);
    wagon1.setSeatCount(4, 2);
    wagon2.setSeatCount(4, 2);
    wagon1.assignTrip(trip);

    for (let i = 0; i < 3; i++) {
      passenger[i] = PassengerFactory().init(stationA, stationB);
    }

    wagon1.stoppedAt(platformA1);

    expect(passenger[0].getPlace()).equals(wagon2);
    expect(passenger[1].getPlace()).equals(wagon2);
    expect(passenger[2].getPlace()).equals(wagon2);
  });

  it('two wagons, put into all', () => {
    const passenger: Passenger[] = [];
    const [wagon1, wagon2] = createConnectedWagons(2);
    wagon1.setSeatCount(2, 2);
    wagon2.setSeatCount(2, 2);
    wagon1.assignTrip(trip);

    for (let i = 0; i < 3; i++) {
      passenger[i] = PassengerFactory().init(stationA, stationB);
    }

    wagon1.stoppedAt(platformA1);

    expect(passenger[0].getPlace()).equals(wagon2);
    expect(passenger[1].getPlace()).equals(wagon2);
    expect(passenger[2].getPlace()).equals(wagon1);
  });

  it('three wagons, some passengers left at station', () => {
    const passenger: Passenger[] = [];
    const [wagon1, wagon2, wagon3] = createConnectedWagons(3);
    wagon1.setSeatCount(2, 2);
    wagon2.setSeatCount(2, 2);
    wagon3.setSeatCount(2, 2);
    wagon1.assignTrip(trip);

    for (let i = 0; i < 7; i++) {
      passenger[i] = PassengerFactory().init(stationA, stationB);
    }

    wagon1.stoppedAt(platformA1);

    expect(passenger[0].getPlace()).equals(wagon3);
    expect(passenger[1].getPlace()).equals(wagon3);
    expect(passenger[2].getPlace()).equals(wagon2);
    expect(passenger[3].getPlace()).equals(wagon2);
    expect(passenger[4].getPlace()).equals(wagon1);
    expect(passenger[5].getPlace()).equals(wagon1);
    expect(passenger[6].getPlace()).equals(platformA1);
  });
});
