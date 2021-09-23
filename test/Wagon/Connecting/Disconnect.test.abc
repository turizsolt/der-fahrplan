import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { buildTrain, W, B } from './utils';
chai.use(chaiAlmost());

describe('WagonDisconnect', () => {
  it('cannot disconnect when moving', () => {
    const [loco]: Wagon[] = buildTrain(W.Loco, W.Pass);
    loco.select();
    loco.accelerate();
    loco.disconnect(B);
    expect(loco.getB().hasConnectedEndOf()).equals(true);
  });

  it('can disconnect when shunting', () => {
    const [loco]: Wagon[] = buildTrain(W.Loco, W.Pass);
    loco.select();
    loco.shuntForward();
    loco.disconnect(B);
    expect(loco.getB().hasConnectedEndOf()).equals(false);
  });
});
