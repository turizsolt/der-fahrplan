import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../../src/di/test.config';
import { TYPES } from '../../../src/di/TYPES';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { BaseStorable } from '../../../src/structs/Interfaces/BaseStorable';
import { Store } from '../../../src/structs/Interfaces/Store';
chai.use(chaiAlmost());

const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
store.clear();
const WagonFactory: () => Wagon = () => store.create<Wagon>(TYPES.Wagon);

describe('Train - getWagons', () => {
  it('has one wagon', () => {
    const w1 = WagonFactory().init();
    const train = w1.getTrain();

    expect(train.getWagons()).deep.equals([w1]);
  });

  it('join two trains, should delete the other', () => {
    const w1 = WagonFactory().init();
    const w2 = WagonFactory().init();
    const t1 = w1.getTrain();
    const t2 = w2.getTrain();

    w1.getB().connect(w2.getA());

    expect(store.get(t1.getId())).equals(undefined);
    expect(store.get(t2.getId())).not.equals(undefined);
    expect(t1.isRemoved()).equals(true);
    expect(t2.isRemoved()).equals(false);
    expect(hashed(t2.getWagons())).deep.equals(hashed([w1, w2]));
  });

  it('has more wagons', () => {
    const w1 = WagonFactory().init();
    const w2 = WagonFactory().init();
    const w3 = WagonFactory().init();

    w1.getB().connect(w2.getA());
    w2.getB().connect(w3.getA());

    const train = w1.getTrain();

    expect(hashed(train.getWagons())).deep.equals(hashed([w1, w2, w3]));
  });

  it('more wagons split into two trains', () => {
    const w1 = WagonFactory().init();
    const w2 = WagonFactory().init();
    const w3 = WagonFactory().init();
    const w4 = WagonFactory().init();
    const w5 = WagonFactory().init();

    w1.getB().connect(w2.getA());
    w2.getB().connect(w3.getA());
    w3.getB().connect(w4.getA());
    w4.getB().connect(w5.getA());

    w2.getB().disconnect();

    const trainLow = w1.getTrain();
    const trainHigh = w5.getTrain();

    expect(hashed(trainLow.getWagons())).deep.equals(hashed([w1, w2]));
    expect(hashed(trainHigh.getWagons())).deep.equals(hashed([w3, w4, w5]));
  });
});

function hashed(arr: BaseStorable[]) {
  const rec: Record<string, string> = {};
  for (let elem of arr) {
    rec[elem.getId()] = elem.getType().toString() + ':' + elem.getId();
  }
  return rec;
}
