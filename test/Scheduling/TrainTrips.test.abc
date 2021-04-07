import { expect } from 'chai';
import { testContainer } from '../../src/di/test.config';
import { TYPES } from '../../src/di/TYPES';
import { Store } from '../../src/structs/Interfaces/Store';
import { buildTrain, W } from '../Wagon/Connecting/utils';
import { Route } from '../../src/structs/Scheduling/Route';
import { Trip } from '../../src/structs/Scheduling/Trip';

export const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
const RouteFactory: () => Route = () => store.create<Route>(TYPES.Route);
const TripFactory: () => Trip = () => store.create<Trip>(TYPES.Trip);

describe('TrainTrips', () => {
  let route: Route, trip: Trip;
  let route2: Route, trip2: Trip;
  let route3: Route, trip3: Trip;

  before(() => {
    store.clear();

    route = RouteFactory().init();
    route.setName('S11');
    trip = TripFactory().init(route, 10);

    route2 = RouteFactory().init();
    route2.setName('S12');
    trip2 = TripFactory().init(route2, 10);

    route3 = RouteFactory().init();
    route3.setName('S13');
    trip3 = TripFactory().init(route3, 10);
  });

  it('train trips get a new element', () => {
    const [loco] = buildTrain(W.Loco, W.Pass, W.Cont);
    const train = loco.getTrain();

    expect(train.getTrips().map(x => x.getId())).deep.equals([]);
    train.assignTrip(trip);

    expect(train.getTrips().map(x => x.getId())).deep.equals([trip.getId()]);
  });

  it("train trips don't get new element, when already present", () => {
    const [loco] = buildTrain(W.Loco, W.Pass, W.Cont);
    const train = loco.getTrain();

    expect(train.getTrips().map(x => x.getId())).deep.equals([]);
    train.assignTrip(trip);
    train.assignTrip(trip);

    expect(train.getTrips().map(x => x.getId())).deep.equals([trip.getId()]);
  });

  it('train trips remove a trip', () => {
    const [loco, pass, cont] = buildTrain(W.Loco, W.Pass, W.Cont);
    const train = loco.getTrain();

    train.assignTrip(trip);
    train.removeTrip(trip);

    expect(train.getTrips().map(x => x.getId())).deep.equals([]);
    expect(loco.getTrip()).equals(undefined);
    expect(pass.getTrip()).equals(undefined);
    expect(cont.getTrip()).equals(undefined);
  });

  it('merges trips, and updates', () => {
    const [loco, pass, cont] = buildTrain(W.Loco, W.Pass, W.Cont);
    const [loco2, pass2, cont2] = buildTrain(W.Loco, W.Pass, W.Cont);
    const train = loco.getTrain();
    const train2 = loco2.getTrain();

    train.assignTrip(trip, [pass]);
    train.assignTrip(trip2, []);

    expect(train.getTrips().map(x => x.getId())).deep.equals([
      trip.getId(),
      trip2.getId()
    ]);

    train2.assignTrip(trip, [pass2]);
    train2.assignTrip(trip3, [cont2]);

    cont.getB().connect(loco2.getA());
    const connectedTrain = loco2.getTrain();

    expect(connectedTrain.getTrips().map(x => x.getId())).deep.equals([
      trip.getId(),
      trip3.getId()
    ]);
  });

  it('separate trips, and updates', () => {
    const [loco, pass, cont, loco2, pass2] = buildTrain(
      W.Loco,
      W.Pass,
      W.Cont,
      W.Loco,
      W.Pass
    );
    const train = loco.getTrain();

    train.assignTrip(trip, [pass, cont]);
    train.assignTrip(trip2, []);
    train.assignTrip(trip3, [pass2]);

    cont.getB().disconnect();
    const train1 = loco.getTrain();
    const train2 = loco2.getTrain();

    expect(train1.getTrips().map(x => x.getId())).deep.equals([trip.getId()]);
    expect(train2.getTrips().map(x => x.getId())).deep.equals([trip3.getId()]);
  });
});
