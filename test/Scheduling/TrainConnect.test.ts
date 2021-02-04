import { expect } from 'chai';
import { testContainer } from '../../src/di/test.config';
import { TYPES } from '../../src/di/TYPES';
import { Store } from '../../src/structs/Interfaces/Store';
import { Wagon } from '../../src/structs/Interfaces/Wagon';
import { A, B } from '../Wagon/Connecting/utils';

export const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
const WagonFactory: () => Wagon = () => store.create<Wagon>(TYPES.Wagon);

describe('Trains', () => {
  before(() => {
    store.clear();
  });

  it('creating a wagon also creates a train with wagons and sides', () => {
    const wagon = WagonFactory().init();
    const train = wagon.getTrain();

    expect(train.getWagonIdsWithSides()).deep.equals([
      { wagonId: wagon.getId(), side: A }
    ]);
  });

  it('connecting two trains AB+,BA->', () => {
    const wagon1 = WagonFactory().init();
    const wagon2 = WagonFactory().init();
    wagon1.getB().connect(wagon2.getB());
    const train = wagon1.getTrain();

    expect(train.getWagonIdsWithSides()).deep.equals([
      { wagonId: wagon1.getId(), side: A },
      { wagonId: wagon2.getId(), side: B }
    ]);
  });

  it('connecting two trains BA+,BA->', () => {
    const wagon1 = WagonFactory().init();
    const wagon2 = WagonFactory().init();
    wagon1.getB().connect(wagon2.getA());
    const train = wagon1.getTrain();

    expect(train.getWagonIdsWithSides()).deep.equals([
      { wagonId: wagon1.getId(), side: A },
      { wagonId: wagon2.getId(), side: A }
    ]);
  });

  it('connecting two trains BA,AB+->', () => {
    const wagon1 = WagonFactory().init();
    const wagon2 = WagonFactory().init();
    wagon1.getA().connect(wagon2.getA());
    const train = wagon1.getTrain();

    expect(train.getWagonIdsWithSides()).deep.equals([
      { wagonId: wagon2.getId(), side: B },
      { wagonId: wagon1.getId(), side: A }
    ]);
  });

  it('connecting two trains BA,BA+->', () => {
    const wagon1 = WagonFactory().init();
    const wagon2 = WagonFactory().init();
    wagon1.getA().connect(wagon2.getB());
    const train = wagon1.getTrain();

    expect(train.getWagonIdsWithSides()).deep.equals([
      { wagonId: wagon2.getId(), side: A },
      { wagonId: wagon1.getId(), side: A }
    ]);
  });

  it('disconnecting two trains', () => {
    const wagon1 = WagonFactory().init();
    const wagon2 = WagonFactory().init();
    wagon1.getA().connect(wagon2.getB());
    wagon1.disconnect(A);
    const train1 = wagon1.getTrain();
    const train2 = wagon2.getTrain();

    expect(train1.getWagonIdsWithSides()).deep.equals([
      { wagonId: wagon1.getId(), side: A }
    ]);

    expect(train2.getWagonIdsWithSides()).deep.equals([
      { wagonId: wagon2.getId(), side: A }
    ]);
  });
});
