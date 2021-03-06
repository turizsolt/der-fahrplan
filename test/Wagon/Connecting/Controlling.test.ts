import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { buildTrain, W, store } from './utils';
chai.use(chaiAlmost());

describe('WagonControlling', () => {
  const [cont1, pass2, loco3, loco4, pass5, loco6]: Wagon[] = buildTrain(
    W.Cont,
    W.Pass,
    W.Loco,
    W.Loco,
    W.Pass,
    W.Loco
  );
  const train = cont1.getTrain();

  step('initially no wagon controls the train', () => {
    expect(train.getControlingWagon()).equals(null);
  });

  step('passenger should not control the speed', () => {
    pass2.accelerate();
    expect(train.getControlingWagon()).equals(null);
    pass2.break();
  });

  step('controller can control the speed', () => {
    cont1.accelerate();
    expect(train.getControlingWagon().getId()).equals(cont1.getId());
    cont1.break();
  });

  step('locomotive can control the speed', () => {
    loco3.accelerate();
    expect(train.getControlingWagon().getId()).equals(loco3.getId());
    loco3.break();
  });

  step('cannot control the speed, when somebody also controls', () => {
    loco3.accelerate();
    loco4.accelerate();
    expect(train.getControlingWagon().getId()).equals(loco3.getId());
    expect(loco4.getSpeed()).equals(0);
    loco3.break();
    expect(train.getControlingWagon()).equals(null);
  });

  step('cannot swap when controling speed (loco)', () => {
    loco3.accelerate();
    loco3.select();
    loco3.swapSelectedSide();
    expect(store.getSelected().getId()).equals(loco3.getId());
    loco3.break();
  });

  step('cannot swap when controling speed (cont)', () => {
    cont1.accelerate();
    cont1.select();
    cont1.swapSelectedSide();
    expect(store.getSelected().getId()).equals(cont1.getId());
    cont1.break();
  });
});
