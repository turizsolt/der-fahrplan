import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import {
  buildTrain,
  W,
  expectTrainSide,
  A,
  B,
  expectTrainSides
} from './utils';

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

    it('single controller wagon - cannot be controlled', () => {
      const [cont]: Wagon[] = buildTrain(W.Cont);
      expectTrainSide(cont, null);

      cont.select();
      expectTrainSide(cont, null, cont);

      cont.swapSelectedSide();
      expectTrainSide(cont, null, cont);
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

    it('cont-good-side and loco - can select both', () => {
      const [cont, loco]: Wagon[] = buildTrain(W.Cont, W.Loco);
      expectTrainSides([cont, loco], [null, null]);

      loco.select();
      expectTrainSides([cont, loco], [null, B], loco);

      loco.swapSelectedSide();
      expectTrainSides([cont, loco], [A, B], cont);

      cont.swapSelectedSide();
      expectTrainSides([cont, loco], [A, B], loco);
    });

    it('loco and cont-bad-side - can select only loco', () => {
      const [loco, cont]: Wagon[] = buildTrain(W.Loco, W.Cont);
      expectTrainSides([loco, cont], [null, null]);

      loco.select();
      expectTrainSides([loco, cont], [A, null], loco);

      loco.swapSelectedSide();
      expectTrainSides([loco, cont], [A, null], loco);
    });

    it('cont-good-side (without loco) and pass - cannot select', () => {
      const [cont, pass]: Wagon[] = buildTrain(W.Cont, W.Pass);
      expectTrainSides([cont, pass], [null, null]);

      cont.select();
      expectTrainSides([cont, pass], [null, null], cont);

      cont.swapSelectedSide();
      expectTrainSides([cont, pass], [null, null], cont);
    });

    it('pass and cont-bad-side - can select nothing', () => {
      const [pass, cont]: Wagon[] = buildTrain(W.Pass, W.Cont);
      expectTrainSides([pass, cont], [null, null]);

      cont.select();
      expectTrainSides([pass, cont], [null, null], cont);

      cont.swapSelectedSide();
      expectTrainSides([pass, cont], [null, null], cont);
    });
  });

  describe('more wagons', () => {
    it('cont loco pass - can select cont A', () => {
      const [cont, loco, pass]: Wagon[] = buildTrain(W.Cont, W.Loco, W.Pass);
      expectTrainSides([cont, loco, pass], [null, null, null]);

      loco.select();
      expectTrainSides([cont, loco, pass], [null, null, null], loco);

      loco.swapSelectedSide();
      expectTrainSides([cont, loco, pass], [A, null, null], cont);

      cont.swapSelectedSide();
      expectTrainSides([cont, loco, pass], [A, null, null], loco);
    });

    it('cont loco cont - can select both ends', () => {
      const [cont, loco, cont2]: Wagon[] = buildTrain(W.Cont, W.Loco, W.Cont);
      loco.getB().disconnect();
      loco.getB().connect(cont2.getB());
      expectTrainSides([cont, loco, cont2], [null, null, null]);

      loco.select();
      expectTrainSides([cont, loco, cont2], [null, null, null], loco);

      loco.swapSelectedSide();
      expectTrainSides([cont, loco, cont2], [A, null, null], cont);

      cont.swapSelectedSide();
      expectTrainSides([cont, loco, cont2], [A, null, A], cont2);

      cont2.swapSelectedSide();
      expectTrainSides([cont, loco, cont2], [A, null, A], cont);
    });
  });
});
