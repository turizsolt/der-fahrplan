import { expect } from 'chai';
import { testContainer } from '../../src/di/test.config';
import { TYPES } from '../../src/di/TYPES';
import { Store } from '../../src/structs/Interfaces/Store';
import { Wagon } from '../../src/structs/Interfaces/Wagon';
import { A } from '../Wagon/Connecting/utils';

export const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
const WagonFactory: () => Wagon = () => store.create<Wagon>(TYPES.Wagon);

describe('Trains', () => {
  before(() => {
    store.clear();
  });

  it('creating a wagon also creates a train', () => {
    const wagon = WagonFactory().init();
    const train = wagon.getTrain();

    expect(train.getWagonsWithSides()).deep.equals([{ wagon, side: A }]);
  });
});
