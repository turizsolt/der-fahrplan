import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { BrickFactory } from '../../../src/structs/Factory/BrickFactory';
import { Route2 } from '../../../src/structs/Scheduling/Route2';
chai.use(chaiAlmost());

const brickFactory = BrickFactory.getInstance();

const ROUTE_NO = 'S12';
const ROUTE_COLOR = '#ff0000';
const ROUTE_NO2 = 'S13';
const ROUTE_COLOR2 = '#00ff00';

describe('Route', () => {
  it('create a route', () => {
    const route: Route2 = brickFactory.createRoute2(ROUTE_NO, ROUTE_COLOR);
    expect(route).not.undefined;
  });

  it('route getters and setters', () => {
    const route: Route2 = brickFactory.createRoute2(ROUTE_NO, ROUTE_COLOR);

    expect(route.getNo()).equals(ROUTE_NO);
    route.setNo(ROUTE_NO2);
    expect(route.getNo()).equals(ROUTE_NO2);

    expect(route.getColor()).equals(ROUTE_COLOR);
    route.setColor(ROUTE_COLOR2);
    expect(route.getColor()).equals(ROUTE_COLOR2);
  });
});
