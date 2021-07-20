import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../../src/di/test.config';
import { TYPES } from '../../../src/di/TYPES';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
chai.use(chaiAlmost());

const WagonFactory = testContainer.get<() => Wagon>(TYPES.FactoryOfWagon);

describe('Train', () => {
  it('one wagon has a train id', () => {
    const w1 = WagonFactory().init();

    expect(w1.getTrain().getType()).equals(TYPES.Train);
  });

  it('two wagons has two different train id', () => {
    const w1 = WagonFactory().init();
    const w2 = WagonFactory().init();

    expect(w1.getTrain().getId()).not.equals(null);
    expect(w2.getTrain().getId()).not.equals(null);
    expect(w1.getTrain().getId()).not.equals(w2.getTrain().getId());
  });

  it('two wagons has same train id AFTER connect', () => {
    const w1 = WagonFactory().init();
    const w2 = WagonFactory().init();

    expect(w1.getTrain().getId()).not.equals(w2.getTrain().getId());

    w1.getB().connect(w2.getA());

    expect(w1.getTrain().getId()).equals(w2.getTrain().getId());
  });

  it('two wagons has different train id AFTER disconnect', () => {
    const w1 = WagonFactory().init();
    const w2 = WagonFactory().init();

    w1.getB().connect(w2.getA());

    expect(w1.getTrain().getId()).equals(w2.getTrain().getId());

    w1.getB().disconnect();

    expect(w1.getTrain().getId()).not.equals(w2.getTrain().getId());
  });

  it('more wagons has different train id AFTER disconnect', () => {
    const w1 = WagonFactory().init();
    const w2 = WagonFactory().init();
    const w3 = WagonFactory().init();
    const w4 = WagonFactory().init();
    const w5 = WagonFactory().init();

    w1.getB().connect(w2.getA());
    w2.getB().connect(w3.getA());
    w3.getB().connect(w4.getA());
    w4.getB().connect(w5.getA());

    expect(w1.getTrain().getId()).equals(w2.getTrain().getId());
    expect(w2.getTrain().getId()).equals(w3.getTrain().getId());
    expect(w3.getTrain().getId()).equals(w4.getTrain().getId());
    expect(w4.getTrain().getId()).equals(w5.getTrain().getId());

    w2.getB().disconnect();

    expect(w1.getTrain().getId()).equals(w2.getTrain().getId());
    expect(w2.getTrain().getId()).not.equals(w3.getTrain().getId());
    expect(w3.getTrain().getId()).equals(w4.getTrain().getId());
    expect(w4.getTrain().getId()).equals(w5.getTrain().getId());
  });
});
