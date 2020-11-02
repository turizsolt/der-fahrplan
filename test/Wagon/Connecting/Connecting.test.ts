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
  describe('single wagon', () => {
    it('single passenger wagon - cannot be controlled', () => {
      const [pass]: Wagon[] = buildTrain(W.Pass);
      expect(pass.getSelectedSide()).equals(null);
      pass.select();
      pass.swapSelectedSide();
      expect(pass.getSelectedSide()).equals(null);
    });

    it('single controller wagon - can be controlled only on A side', () => {
      const [cont]: Wagon[] = buildTrain(W.Cont);
      expect(cont.getSelectedSide()).equals(null);
      cont.select();
      expect(cont.getSelectedSide()).equals(WhichEnd.A);
      cont.swapSelectedSide();
      expect(cont.getSelectedSide()).equals(WhichEnd.A);
      cont.swapSelectedSide();
      expect(cont.getSelectedSide()).equals(WhichEnd.A);
    });

    it('single locomotive wagon - can be controlled', () => {
      const [loco]: Wagon[] = buildTrain(W.Loco);
      expect(loco.getSelectedSide()).equals(null);
      loco.select();
      expect(loco.getSelectedSide()).equals(WhichEnd.A);
      loco.swapSelectedSide();
      expect(loco.getSelectedSide()).equals(WhichEnd.B);
      loco.swapSelectedSide();
      expect(loco.getSelectedSide()).equals(WhichEnd.A);
    });
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
