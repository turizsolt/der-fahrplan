import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { BrickFactory } from '../../../src/structs/Factory/BrickFactory';
import { WhichEnd } from '../../../src/structs/Interfaces/WhichEnd';
import { RoutePart } from '../../../src/structs/Scheduling/RoutePart';
chai.use(chaiAlmost());

const brickFactory = BrickFactory.getInstance();

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
});
