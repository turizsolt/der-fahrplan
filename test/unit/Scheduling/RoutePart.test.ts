import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { BrickFactory } from '../../../src/structs/Factory/BrickFactory';
import { WhichEnd } from '../../../src/structs/Interfaces/WhichEnd';
import { RoutePart } from '../../../src/structs/Scheduling/RoutePart';
import { RoutePartEdge } from '../../../src/structs/Scheduling/RoutePartEdge';
import { RoutePartJunction } from '../../../src/structs/Scheduling/RoutePartJunction';
import { RoutePartStop } from '../../../src/structs/Scheduling/RoutePartStop';
chai.use(chaiAlmost());

const brickFactory = BrickFactory.getInstance();

const FOUR_MINUTES = 4 * 60 * 60;
const HALF_MINUTES = 30 * 60;
const ZERO_MINUTES = 0;

describe('RoutePart', () => {
  it('create a RoutePart', () => {
    const routePart: RoutePart = brickFactory.createRoutePart();
    expect(routePart).not.undefined;
  });

  it('linking two parts', () => {
    const rp1: RoutePart = brickFactory.createRoutePart();
    const rp2: RoutePart = brickFactory.createRoutePart();
    rp1.setNext(WhichEnd.B, rp2);

    expect(rp1.getNext(WhichEnd.B)).equals(rp2);
    expect(rp2.getNext(WhichEnd.A)).equals(rp1);
  });

  it('get duration', () => {
    const routePart: RoutePart = brickFactory.createRoutePart();
    expect(routePart.getDuration()).equals(ZERO_MINUTES);
  });

  describe('RoutePartStop', () => {
    it('get duration, ends are zero, middle is not', () => {
      const rp1: RoutePart = brickFactory.createRoutePartStop();
      const rp2: RoutePart = brickFactory.createRoutePartStop();
      const rp3: RoutePart = brickFactory.createRoutePartStop();
      rp1.setNext(WhichEnd.B, rp2);
      rp2.setNext(WhichEnd.B, rp3);

      expect(rp1.getDuration()).equals(ZERO_MINUTES);
      expect(rp2.getDuration()).equals(HALF_MINUTES);
      expect(rp3.getDuration()).equals(ZERO_MINUTES);
    });

    it('set duration in the middle', () => {
      const rp1: RoutePart = brickFactory.createRoutePartStop();
      const rp2: RoutePartStop = brickFactory.createRoutePartStop();
      const rp3: RoutePart = brickFactory.createRoutePartStop();
      rp1.setNext(WhichEnd.B, rp2);
      rp2.setNext(WhichEnd.B, rp3);

      rp2.setDuration(FOUR_MINUTES);
      expect(rp2.getDuration()).equals(FOUR_MINUTES);
    });
  });

  describe('RoutePartJunction', () => {
    it('get and set duration', () => {
      const junction: RoutePartJunction = brickFactory.createRoutePartJunction();

      expect(junction.getDuration()).equals(ZERO_MINUTES);
      junction.setDuration(FOUR_MINUTES);
      expect(junction.getDuration()).equals(FOUR_MINUTES);
    });
  });

  describe('RoutePartEdge', () => {
    it('get duration', () => {
      const edge: RoutePartEdge = brickFactory.createRoutePartEdge({ duration: FOUR_MINUTES });

      expect(edge.getDuration()).equals(FOUR_MINUTES);
    });
  });

  it('isStopping', () => {
    const stop: RoutePartStop = brickFactory.createRoutePartStop();
    const part: RoutePart = brickFactory.createRoutePart();
    const junction: RoutePart = brickFactory.createRoutePartJunction();
    const edge: RoutePart = brickFactory.createRoutePartEdge({ duration: FOUR_MINUTES });

    expect(stop.isStopping()).equals(true);
    expect(part.isStopping()).equals(false);
    expect(junction.isStopping()).equals(false);
    expect(edge.isStopping()).equals(false);

    stop.setStopping(false);
    expect(stop.isStopping()).equals(false);
  });
});
