import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../../src/di/test.config';
import { TYPES } from '../../../src/di/TYPES';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { Store } from '../../../src/structs/Interfaces/Store';
import { Train } from '../../../src/structs/Scheduling/Train';
chai.use(chaiAlmost());

const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
store.clear();
const WagonFactory: () => Wagon = () => store.create<Wagon>(TYPES.Wagon);

describe('Train', () => {
  it('remove', () => {
    const w1 = WagonFactory().init();
    const train = w1.getTrain();

    expect(train.isRemoved()).equals(false);

    train.remove();

    expect(train.isRemoved()).equals(true);
  });

  it('persist and load', () => {
    store.clear();
    const w1 = WagonFactory().init();
    const train = w1.getTrain();

    const obj: any = train.persist();

    store.clear();
    train.load(obj, store);

    const storedTrain = store.get(obj.id) as Train;

    expect(storedTrain.getId()).equals(train.getId());
    expect(storedTrain.getWagons().length).equals(train.getWagons().length);
  });
});
