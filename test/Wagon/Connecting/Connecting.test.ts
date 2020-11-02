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
      expectTrainSide(pass, null);

      pass.select();
      expectTrainSide(pass, null, pass);

      pass.swapSelectedSide();
      expectTrainSide(pass, null, pass);
    });

    it('single controller wagon - can be controlled only on A side', () => {
      const [cont]: Wagon[] = buildTrain(W.Cont);
      expectTrainSide(cont, null);

      cont.select();
      expectTrainSide(cont, A, cont);

      cont.swapSelectedSide();
      expectTrainSide(cont, A, cont);

      cont.swapSelectedSide();
      expectTrainSide(cont, A, cont);
    });

    it('single locomotive wagon - can be controlled', () => {
      const [loco]: Wagon[] = buildTrain(W.Loco);
      expectTrainSide(loco, null);

      loco.select();
      expectTrainSide(loco, A, loco);

      loco.swapSelectedSide();
      expectTrainSide(loco, B, loco);

      loco.swapSelectedSide();
      expectTrainSide(loco, A, loco);
    });
  });

  describe('two wagons', () => {
    it("loco and pass - can select loco's A", () => {
      const [loco, pass]: Wagon[] = buildTrain(W.Loco, W.Pass);
      expectTrainSides([loco, pass], [null, null]);

      loco.select();
      expectTrainSides([loco, pass], [A, null], loco);

      loco.swapSelectedSide();
      expectTrainSides([loco, pass], [A, null], loco);
    });

    it('loco and loco AB - can select both ends', () => {
      const [locoA, locoB]: Wagon[] = buildTrain(W.Loco, W.Loco);
      expectTrainSides([locoA, locoB], [null, null]);

      locoA.select();
      expectTrainSides([locoA, locoB], [A, null], locoA);

      locoA.swapSelectedSide();
      expectTrainSides([locoA, locoB], [A, B], locoB);
    });

    it('loco and loco BA - can select both ends', () => {
      const [locoA, locoB]: Wagon[] = buildTrain(W.Loco, W.Loco);
      expectTrainSides([locoA, locoB], [null, null]);

      locoB.select();
      expectTrainSides([locoA, locoB], [null, B], locoB);

      locoB.swapSelectedSide();
      expectTrainSides([locoA, locoB], [A, B], locoA);
    });

    it('loco and cont-good-side - can select both', () => {
      const [loco, cont]: Wagon[] = buildTrain(W.Loco, W.Cont);
      loco.getB().disconnect();
      loco.getB().connect(cont.getB());
      expectTrainSides([loco, cont], [null, null]);

      loco.select();
      expectTrainSides([loco, cont], [A, null], loco);

      loco.swapSelectedSide();
      expectTrainSides([loco, cont], [A, A], cont);

      cont.swapSelectedSide();
      expectTrainSides([loco, cont], [A, A], loco);
    });

    it('loco and cont-bad-side - can select only loco', () => {
      const [loco, cont]: Wagon[] = buildTrain(W.Loco, W.Cont);
      expectTrainSides([loco, cont], [null, null]);

      loco.select();
      expectTrainSides([loco, cont], [A, null], loco);

      loco.swapSelectedSide();
      expectTrainSides([loco, cont], [A, null], loco);
    });
  });
});

const A = WhichEnd.A;
const B = WhichEnd.B;

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

function expectTrainSides(
  wagons: Wagon[],
  sides: WhichEnd[],
  selected?: Wagon
) {
  for (let i = 0; i < wagons.length; i++) {
    expect(wagons[i].getSelectedSide()).equals(
      sides[i],
      'offset ' + i.toString()
    );
  }
  expectTrainSelected(selected);
}

function expectTrainSide(wagon: Wagon, side: WhichEnd, selected?: Wagon) {
  expect(wagon.getSelectedSide()).equals(side);
  expectTrainSelected(selected);
}

function expectTrainSelected(selected?: Wagon) {
  if (selected !== undefined) {
    if (selected) {
      expect(store.getSelected().getId()).equals(selected.getId());
    } else {
      expect(store.getSelected()).equals(null);
    }
  }
}
