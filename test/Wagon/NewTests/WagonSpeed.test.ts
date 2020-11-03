import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import WagonSpeed from '../../../src/structs/Actuals/Wagon/WagonSpeed';
import { WagonMovingState } from '../../../src/structs/Actuals/Wagon/WagonMovingState';
import { Store } from '../../../src/structs/Interfaces/Store';
import { testContainer } from '../../../src/di/test.config';
import { TYPES } from '../../../src/di/TYPES';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
chai.use(chaiAlmost());

const store: Store = testContainer
  .get<() => Store>(TYPES.FactoryOfStore)()
  .init();
store.clear();
const WagonFactory: () => Wagon = () => store.create<Wagon>(TYPES.Wagon);
const wagon = WagonFactory().init();

describe('WagonSpeedControl', () => {
  it('accelerates til maxSpeed', () => {
    const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
    expect(control.getSpeed()).equals(0);
    control.accelerate();
    expect(control.getSpeed()).equals(1);
    control.accelerate();
    expect(control.getSpeed()).equals(2);
    control.accelerate();
    expect(control.getSpeed()).equals(2);
  });

  it('breaks till zero', () => {
    const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
    control.accelerate();
    control.accelerate();
    expect(control.getSpeed()).equals(2);
    control.break();
    expect(control.getSpeed()).equals(1);
    control.break();
    expect(control.getSpeed()).equals(0);
    control.break();
    expect(control.getSpeed()).equals(0);
  });

  it('can shount forward and only once', () => {
    const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
    expect(control.getSpeed()).equals(0);
    control.shountForward();
    expect(control.getSpeed()).equals(1);
    control.shountForward();
    expect(control.getSpeed()).equals(1);
    control.break();
    expect(control.getSpeed()).equals(0);
  });

  it('can shount backward and only once', () => {
    const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
    expect(control.getSpeed()).equals(0);
    control.shountBackward();
    expect(control.getSpeed()).equals(-1);
    control.shountBackward();
    expect(control.getSpeed()).equals(-1);
    control.break();
    expect(control.getSpeed()).equals(0);
  });

  it('cannot shount when not stopped', () => {
    const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
    control.accelerate();
    control.accelerate();
    expect(control.getSpeed()).equals(2);
    control.shountForward();
    expect(control.getSpeed()).equals(2);
    control.shountBackward();
    expect(control.getSpeed()).equals(2);
  });

  it('cannot shount when not stopped', () => {
    const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
    control.accelerate();
    control.accelerate();
    expect(control.getSpeed()).equals(2);
    control.shountForward();
    expect(control.getSpeed()).equals(2);
    control.shountBackward();
    expect(control.getSpeed()).equals(2);
  });

  it('emergency break applied', () => {
    const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
    control.accelerate();
    control.accelerate();
    control.tick();
    control.emergencyBreak();
    expect(control.getSpeed()).equals(2);
    control.tick();
    expect(control.getSpeed()).equals(1);
    control.tick();
    expect(control.getSpeed()).equals(0);
  });

  it('cannot start, while emergency break applied', () => {
    const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
    control.emergencyBreak();
    control.accelerate();
    expect(control.getSpeed()).equals(0);
    control.shountForward();
    expect(control.getSpeed()).equals(0);
    control.shountBackward();
    expect(control.getSpeed()).equals(0);
    control.releaseEmergencyBreak();
    control.accelerate();
    expect(control.getSpeed()).equals(1);
  });

  it('cannot accelerate on shunting', () => {
    const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
    control.shountForward();
    expect(control.getSpeed()).equals(1);
    control.accelerate();
    expect(control.getSpeed()).equals(1);
  });

  describe('movingState', () => {
    it('standing - when there is no moving', () => {
      const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
      expect(control.getMovingState()).equals(WagonMovingState.Standing);
    });

    it('moving - when there is speed', () => {
      const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
      control.accelerate();
      expect(control.getMovingState()).equals(WagonMovingState.Moving);
    });

    it('standing - when stopped after moving', () => {
      const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
      control.accelerate();
      control.break();
      expect(control.getMovingState()).equals(WagonMovingState.Standing);
    });

    it('shunting - when there is shunting forward', () => {
      const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
      control.shountForward();
      expect(control.getMovingState()).equals(WagonMovingState.Shunting);
    });

    it('shunting - when there is shunting backward', () => {
      const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
      control.shountBackward();
      expect(control.getMovingState()).equals(WagonMovingState.Shunting);
    });

    it('shunting - when stopped after shunting', () => {
      const control: WagonSpeed = new WagonSpeed(wagon, 2, 1);
      control.shountBackward();
      control.break();
      expect(control.getMovingState()).equals(WagonMovingState.Standing);
    });
  });
});
