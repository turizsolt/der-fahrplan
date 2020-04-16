import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../src/di/test.config';
import { TYPES } from '../../src/di/TYPES';
import { Wagon } from '../../src/structs/Interfaces/Wagon';
chai.use(chaiAlmost());

const WagonFactory = testContainer.get<() => Wagon>(TYPES.FactoryOfWagon);

describe('Wagon', () => {
  it('connect two wagons', () => {
    const w1 = WagonFactory().init();
    const w2 = WagonFactory().init();

    w1.getA().connect(w2.getB());

    expect(w1.getA().getConnectedEndOf()).equals(w2);
    expect(w2.getB().getConnectedEndOf()).equals(w1);
  });
});
