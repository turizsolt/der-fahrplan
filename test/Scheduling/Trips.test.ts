import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../src/di/test.config';
import { TYPES } from '../../src/di/TYPES';
import { Route } from '../../src/structs/Scheduling/Route';
import { Store } from '../../src/structs/Interfaces/Store';
import { Trip } from '../../src/structs/Scheduling/Trip';
chai.use(chaiAlmost());

export const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
store.clear();
const RouteFactory: () => Route = () => store.create<Route>(TYPES.Route);
const TripFactory: () => Trip = () => store.create<Trip>(TYPES.Trip);

describe('Trips', () => {
  it('creates a new trip', () => {
    const route = RouteFactory().init();
    const trip = TripFactory().init(route, 0);
  });
});
