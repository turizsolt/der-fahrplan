import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { BrickFactory } from '../../../src/structs/Factory/BrickFactory';
import { Route2 } from '../../../src/structs/Scheduling/Route2';
chai.use(chaiAlmost());

const brickFactory = BrickFactory.getInstance();

const ROUTE_NO = 'S12';
const ROUTE_COLOR = '#ff0000';

describe('Route', () => {
  it('create a route', () => {
    const route: Route2 = brickFactory.createRoute2(ROUTE_NO, ROUTE_COLOR);
    expect(route).not.undefined;
  });
});
