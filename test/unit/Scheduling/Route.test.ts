import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { BrickFactory } from '../../../src/structs/Factory/BrickFactory';
import { WhichEnd } from '../../../src/structs/Interfaces/WhichEnd';
import { Route2 } from '../../../src/structs/Scheduling/Route2';
import { RoutePart } from '../../../src/structs/Scheduling/RoutePart';
import { RoutePartReference } from '../../../src/structs/Scheduling/RoutePartReference';
import { RoutePartReferenceColor } from '../../../src/structs/Scheduling/RoutePartReferenceColor';
chai.use(chaiAlmost());

const brickFactory = BrickFactory.getInstance();

const ROUTE_NO = 'S12';
const ROUTE_COLOR = '#ff0000';
const ROUTE_NO2 = 'S13';
const ROUTE_COLOR2 = '#00ff00';

const NAME = 'Name';
const COLOR = '#ff0000';

const REFERENCE: RoutePartReference = {
  getName: () => NAME,
};

const REFERENCE_COLOR: RoutePartReferenceColor = {
  ...REFERENCE,
  getColor: () => COLOR
};

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

  it('add one RoutePart to Route', () => {
    const route: Route2 = brickFactory.createRoute2(ROUTE_NO, ROUTE_COLOR);
    const stop: RoutePart = brickFactory.createRoutePartStop(REFERENCE_COLOR);

    expect(route.getParts(WhichEnd.A).length).equals(0);
    expect(route.getParts(WhichEnd.B).length).equals(0);

    route.addPart(WhichEnd.A, stop);

    const partsA = route.getParts(WhichEnd.A);
    const partsB = route.getParts(WhichEnd.B);
    expect(partsA[0]).equals(stop);
    expect(partsB[0]).equals(stop);
  });

  it('add two RouteParts to Route', () => {
    const route: Route2 = brickFactory.createRoute2(ROUTE_NO, ROUTE_COLOR);
    const stop: RoutePart = brickFactory.createRoutePartStop(REFERENCE_COLOR);
    const stop2: RoutePart = brickFactory.createRoutePartStop(REFERENCE_COLOR);

    route.addPart(WhichEnd.B, stop);
    route.addPart(WhichEnd.B, stop2);

    const partsA = route.getParts(WhichEnd.A);
    expect(partsA[0]).equals(stop);
    expect(partsA[1]).equals(stop2);

    const partsB = route.getParts(WhichEnd.B);
    expect(partsB[0]).equals(stop2);
    expect(partsB[1]).equals(stop);
  });

  it('remove two RouteParts from Route', () => {
    const route: Route2 = brickFactory.createRoute2(ROUTE_NO, ROUTE_COLOR);
    const stop: RoutePart = brickFactory.createRoutePartStop(REFERENCE_COLOR);
    const stop2: RoutePart = brickFactory.createRoutePartStop(REFERENCE_COLOR);

    route.addPart(WhichEnd.B, stop);
    route.addPart(WhichEnd.B, stop2);
    expect(route.getParts(WhichEnd.A).length).equals(2);

    route.removePart(WhichEnd.B);
    expect(route.getParts(WhichEnd.A).length).equals(1);

    route.removePart(WhichEnd.B);
    expect(route.getParts(WhichEnd.A).length).equals(0);
    expect(route.getParts(WhichEnd.B).length).equals(0);

    route.removePart(WhichEnd.B);
    expect(route.getParts(WhichEnd.A).length).equals(0);
  });
});
