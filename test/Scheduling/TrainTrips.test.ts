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

  before(() => {
    store.clear();

    route = RouteFactory().init();
    route.setName('S12');

    trip = TripFactory().init(route, 10);
  });

  it('train trips get a new element', () => {
    const [loco, pass, cont] = buildTrain(W.Loco, W.Pass, W.Cont);
    const train = loco.getTrain();

    expect(train.getTrips().map(x => x.getId())).deep.equals([]);
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
});
