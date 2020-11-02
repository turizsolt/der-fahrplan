import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { buildTrain, W } from './utils';
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
});
