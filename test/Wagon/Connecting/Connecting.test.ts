import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { Store } from '../../../src/structs/Interfaces/Store';
import { testContainer } from '../../../src/di/test.config';
import { TYPES } from '../../../src/di/TYPES';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { getPredefinedWagonConfig } from '../../../src/structs/Actuals/Wagon/ActualWagonConfigs';
import { WhichEnd } from '../../../src/structs/Interfaces/WhichEnd';
chai.use(chaiAlmost());

const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
store.clear();
const WagonFactory: () => Wagon = () => store.create<Wagon>(TYPES.Wagon);

describe('WagonConnect and Control', () => {
  it('single passenger wagon - cannot be controlled', () => {
    const [w1]: Wagon[] = buildTrain(W.Pass);
    expect(w1.getSelectedSide()).equals(null);
    w1.select();
    w1.swapSelectedSide();
    expect(w1.getSelectedSide()).equals(null);
  });

  it('single controller wagon - can be controlled only on A side', () => {
    const [w1]: Wagon[] = buildTrain(W.Cont);
    expect(w1.getSelectedSide()).equals(null);
    w1.select();
    expect(w1.getSelectedSide()).equals(WhichEnd.A);
    w1.swapSelectedSide();
    expect(w1.getSelectedSide()).equals(WhichEnd.A);
    w1.swapSelectedSide();
    expect(w1.getSelectedSide()).equals(WhichEnd.A);
  });

  it('single locomotive wagon - can be controlled', () => {
    const [w1]: Wagon[] = buildTrain(W.Loco);
    expect(w1.getSelectedSide()).equals(null);
    w1.select();
    expect(w1.getSelectedSide()).equals(WhichEnd.A);
    w1.swapSelectedSide();
    expect(w1.getSelectedSide()).equals(WhichEnd.B);
    w1.swapSelectedSide();
    expect(w1.getSelectedSide()).equals(WhichEnd.A);
  });
});

enum W {
  Loco = 'locomotive',
  Pass = 'passenger',
  Cont = 'controlCar',
  Comb = 'combined'
}

function buildTrain(...wagonStrings: string[]): Wagon[] {
  const returnedWagons: Wagon[] = [];
  for (let wagonString of wagonStrings) {
    returnedWagons.push(
      WagonFactory().init(getPredefinedWagonConfig(wagonString))
    );
  }
  for (let i = 1; i < returnedWagons.length; i++) {
    returnedWagons[i - 1].getB().connect(returnedWagons[i].getA());
  }

  return returnedWagons;
}
