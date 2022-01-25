import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { BrickFactory } from '../../../src/structs/Factory/BrickFactory';
import { WhichEnd } from '../../../src/structs/Interfaces/WhichEnd';
import { Route } from '../../../src/structs/Scheduling/Route';
import { RoutePart } from '../../../src/structs/Scheduling/RoutePart';
import { RoutePartReference } from '../../../src/structs/Scheduling/RoutePartReference';
import { RoutePartReferenceColor } from '../../../src/structs/Scheduling/RoutePartReferenceColor';
import { RouteVariant } from '../../../src/structs/Scheduling/RouteVariant';
chai.use(chaiAlmost());

const brickFactory = BrickFactory.getInstance();

const ROUTE_NO = 'S12';
const ROUTE_COLOR = '#ff0000';

const NAME = 'Name';
const COLOR = '#ff0000';

const REFERENCE: RoutePartReference = {
  getName: () => NAME,
  getId: () => 'id'
};

const REFERENCE_COLOR: RoutePartReferenceColor = {
  ...REFERENCE,
  getColor: () => COLOR
};

describe('RouteVariant', () => {
  it('get RouteVariants', () => {
    const route: Route = brickFactory.createRoute(ROUTE_NO, ROUTE_COLOR);
    const stop1: RoutePart = brickFactory.createRoutePartStop(REFERENCE_COLOR);
    const junction2: RoutePart = brickFactory.createRoutePartJunction(REFERENCE_COLOR);
    const stop3: RoutePart = brickFactory.createRoutePartStop(REFERENCE_COLOR);

    route.addPart(WhichEnd.B, stop1);
    route.addPart(WhichEnd.B, junction2);
    route.addPart(WhichEnd.B, stop3);

    const variants: RouteVariant[] = route.getVariants();
    expect(variants.length).equals(2);

    expect(variants[0].getFirstStop()).equals(stop1);
    expect(variants[0].getLastStop()).equals(stop3);

    expect(variants[1].getFirstStop()).equals(stop3);
    expect(variants[1].getLastStop()).equals(stop1);

    expect(variants[0].getStops()).deep.equals([stop1, stop3]);

    expect(variants[0].getWaypoints()).deep.equals([stop1, junction2, stop3]);
  });
});
