import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { ActualTrainSpeed } from '../../../src/modules/Train/ActualTrainSpeed';
import { SpeedPedal } from '../../../src/modules/Train/SpeedPedal';
chai.use(chaiAlmost());

describe('TrainSpeed', () => {
  it('shunting', () => {
    const speed = new ActualTrainSpeed();
    speed.setShunting(true);
    expect(speed.isShunting()).is.true;
    speed.setShunting(false);
    expect(speed.isShunting()).is.false;
  });

  it('pedal', () => {
    const speed = new ActualTrainSpeed();
    speed.setPedal(SpeedPedal.Throttle);
    speed.tick();
    expect(speed.getSpeed()).gt(0);
    speed.setShunting(true);
    expect(speed.isShunting()).is.false;
    speed.setPedal(SpeedPedal.Brake);
    speed.tick();
    expect(speed.getSpeed()).eq(0);
  });
});
