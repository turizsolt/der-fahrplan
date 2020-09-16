import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import WagonSpeed from '../../../src/structs/Actuals/Wagon/WagonSpeed';
chai.use(chaiAlmost());

describe('WagonSpeedControl', () => {
  it('accelerates til maxSpeed', () => {
    const control: WagonSpeed = new WagonSpeed(2);
    expect(control.getSpeed()).equals(0);
    control.accelerate();
    expect(control.getSpeed()).equals(1);
    control.accelerate();
    expect(control.getSpeed()).equals(2);
    control.accelerate();
    expect(control.getSpeed()).equals(2);
  });

  it('breaks till zero', () => {
    const control: WagonSpeed = new WagonSpeed(2);
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
    const control: WagonSpeed = new WagonSpeed(2);
    expect(control.getSpeed()).equals(0);
    control.shountForward();
    expect(control.getSpeed()).equals(1);
    control.shountForward();
    expect(control.getSpeed()).equals(1);
    control.break();
    expect(control.getSpeed()).equals(0);
  });

  it('can shount backward and only once', () => {
    const control: WagonSpeed = new WagonSpeed(2);
    expect(control.getSpeed()).equals(0);
    control.shountBackward();
    expect(control.getSpeed()).equals(-1);
    control.shountBackward();
    expect(control.getSpeed()).equals(-1);
    control.break();
    expect(control.getSpeed()).equals(0);
  });

  it('cannot shount when not stopped', () => {
    const control: WagonSpeed = new WagonSpeed(2);
    control.accelerate();
    control.accelerate();
    expect(control.getSpeed()).equals(2);
    control.shountForward();
    expect(control.getSpeed()).equals(2);
    control.shountBackward();
    expect(control.getSpeed()).equals(2);
  });

  it('cannot shount when not stopped', () => {
    const control: WagonSpeed = new WagonSpeed(2);
    control.accelerate();
    control.accelerate();
    expect(control.getSpeed()).equals(2);
    control.shountForward();
    expect(control.getSpeed()).equals(2);
    control.shountBackward();
    expect(control.getSpeed()).equals(2);
  });

  it('emergency break applied', () => {
    const control: WagonSpeed = new WagonSpeed(2);
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
    const control: WagonSpeed = new WagonSpeed(2);
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
});