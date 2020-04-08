import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../src/di/test.config';
import { TYPES } from '../../src/di/TYPES';
import { Wagon } from '../../src/structs/Interfaces/Wagon';
chai.use(chaiAlmost());

const WagonFactory = testContainer.get<() => Wagon>(TYPES.FactoryOfWagon);

describe('Train', () => {
  it('one wagon has a train id', () => {
    const w1 = WagonFactory().init();

    expect(w1.getTrain().getType()).equals(Symbol.for('Train'));
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
});
