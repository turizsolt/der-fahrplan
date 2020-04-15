import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../../src/di/test.config';
import { TYPES } from '../../../src/di/TYPES';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { Store } from '../../../src/structs/Interfaces/Store';
import { Route } from '../../../src/structs/Scheduling/Route';
chai.use(chaiAlmost());

const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
store.clear();
const WagonFactory: () => Wagon = () => store.create<Wagon>(TYPES.Wagon);
const RouteFactory: () => Route = () => store.create<Route>(TYPES.Route);

describe('Train - getTrip', () => {
  const trip = RouteFactory().init();
  const trip2 = RouteFactory().init();

  it('1 wagon, 1 trip - train gets it', () => {
    const [w1] = createConnectedWagons(1);
    w1.assignTrip(trip);
    const train = w1.getTrain();

    expect(train.getTrip()).deep.equals(trip);
  });

  it('1 wagon, no trip - train gets it', () => {
    const [w1] = createConnectedWagons(1);
    const train = w1.getTrain();

    expect(train.getTrip()).deep.equals(null);
  });

  it('2 wagons, 1 trip - other gets it, this keeps it', () => {
    const w1 = WagonFactory().init();
    const w2 = WagonFactory().init();
    w1.assignTrip(trip);
    w1.getB().connect(w2.getA());

    expect(w1.getTrip()).deep.equals(trip);
    expect(w2.getTrip()).deep.equals(trip);
  });

  it('2 wagons, no trip - other gets it, this keeps it', () => {
    const [w1, w2] = createConnectedWagons(2);

    expect(w1.getTrip()).deep.equals(null);
    expect(w2.getTrip()).deep.equals(null);
  });

  it('2 wagons, trip, assign new trip to other - cancel original, and update both', () => {
    const w1 = WagonFactory().init();
    const w2 = WagonFactory().init();
    w1.assignTrip(trip);
    w1.getB().connect(w2.getA());
    w2.assignTrip(trip2);

    expect(w1.getTrip()).deep.equals(trip2);
    expect(w2.getTrip()).deep.equals(trip2);
  });

  it('2 wagons, trip, assign new trip after connected - update both', () => {
    const [w1, w2] = createConnectedWagons(2);
    w2.assignTrip(trip);

    expect(w1.getTrip()).deep.equals(trip);
    expect(w2.getTrip()).deep.equals(trip);
  });

  it('4 wagons, none has trip, after separating none has trip', () => {
    const [w1, w2, w3, w4] = createConnectedWagons(4);

    w2.getB().disconnect();

    const expected = [null, null, null, null];
    expect([w1, w2, w3, w4].map(x => x.getTrip())).deep.equals(expected);
  });

  it('4 wagons, first has trip, after separating just the firsts has trip', () => {
    const [w1, w2, w3, w4] = createConnectedWagons(4);
    w1.assignTrip(trip);

    w2.getB().disconnect();

    const expected = [trip, trip, null, null];
    expect([w1, w2, w3, w4].map(x => x.getTrip())).deep.equals(expected);
  });

  it('2 trains, none has trip', () => {
    const [w1, w2] = createConnectedWagons(2);
    const [w3, w4, w5] = createConnectedWagons(3);

    w2.getB().connect(w3.getA());

    const expected = [null, null, null, null, null];
    expect([w1, w2, w3, w4, w5].map(x => x.getTrip())).deep.equals(expected);
  });

  it('2 trains, first has trip', () => {
    const [w1, w2] = createConnectedWagons(2);
    const [w3, w4, w5] = createConnectedWagons(3);
    w1.assignTrip(trip);

    w2.getB().connect(w3.getA());

    const expected = [trip, trip, trip, trip, trip];
    expect([w1, w2, w3, w4, w5].map(x => x.getTrip())).deep.equals(expected);
  });

  it('2 trains, second has trip', () => {
    const [w1, w2] = createConnectedWagons(2);
    const [w3, w4, w5] = createConnectedWagons(3);
    w5.assignTrip(trip);

    w2.getB().connect(w3.getA());

    const expected = [trip, trip, trip, trip, trip];
    expect([w1, w2, w3, w4, w5].map(x => x.getTrip())).deep.equals(expected);
  });

  it('2 trains, both have trip, keeps high-end', () => {
    const [w1, w2] = createConnectedWagons(2);
    const [w3, w4, w5] = createConnectedWagons(3);
    w1.assignTrip(trip2);
    w5.assignTrip(trip);

    w2.getB().connect(w3.getA());

    const expected = [trip, trip, trip, trip, trip];
    expect([w1, w2, w3, w4, w5].map(x => x.getTrip())).deep.equals(expected);
  });

  it('2 trains, both have trip, keeps low-end', () => {
    const [w1, w2] = createConnectedWagons(2);
    const [w3, w4, w5] = createConnectedWagons(3);
    w1.assignTrip(trip);
    w5.assignTrip(trip2);

    w3.getA().connect(w2.getB());

    const expected = [trip, trip, trip, trip, trip];
    expect([w1, w2, w3, w4, w5].map(x => x.getTrip())).deep.equals(expected);
  });
});

export function createConnectedWagons(n: number) {
  let lastWagon = WagonFactory().init();
  let wagons = [lastWagon];
  for (let i = 1; i < n; i++) {
    const newWagon = WagonFactory().init();
    wagons.push(newWagon);
    lastWagon.getB().connect(newWagon.getA());
    lastWagon = newWagon;
  }
  return wagons;
}
