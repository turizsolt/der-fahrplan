import { WagonMovingState } from './WagonMovingState';
import { Wagon } from '../../Interfaces/Wagon';
import { WagonControlType } from './WagonControl/WagonControlType';

export default class WagonSpeed {
  private speed: number = 0;
  private emergencyBreakApplied: boolean = false;
  private shunting: boolean = false;

  constructor(
    private wagon: Wagon,
    private maxSpeed: number = 3,
    private accelerateBy: number = 0.25
  ) { }

  halt(): void {
    this.speed = 0;
    this.wagon.clearControlingWagon();
    this.shunting = false;
  }

  getSpeed(): number {
    return this.speed;
  }

  getMaxSpeed(): number {
    return this.maxSpeed;
  }

  getAcceleateBy(): number {
    return this.accelerateBy;
  }

  accelerate(): void {
    if (this.canAccelerate() && this.speed < this.maxSpeed) {
      if (this.speed === 0) {
        // todo these seems duplicate entries for the same purpose
        this.wagon.getTrain().setMovingness(true);
        this.wagon.setControlingWagon(this.wagon);
      }

      this.speed += this.accelerateBy;
    }
  }

  break(): void {
    if (this.speed > this.accelerateBy) {
      this.speed -= this.accelerateBy;
    } else {
      this.speed = 0;
      this.wagon.getTrain().setMovingness(false);
      this.wagon.clearControlingWagon();
    }
    this.shunting = false;
  }

  shountForward(): void {
    if (this.canShunt()) {
      if (this.speed === 0) {
        this.wagon.getTrain().setMovingness(true);
        this.wagon.setControlingWagon(this.wagon);
      }

      this.speed = this.accelerateBy;
      this.shunting = true;
    }
  }

  shountBackward(): void {
    if (this.canShunt()) {
      if (this.speed === 0) {
        this.wagon.getTrain().setMovingness(true);
        this.wagon.setControlingWagon(this.wagon);
      }

      this.speed = -this.accelerateBy;
      this.shunting = true;
    }
  }

  tick(): void {
    if (this.emergencyBreakApplied) {
      this.break();
    }
  }

  emergencyBreak(): void {
    this.emergencyBreakApplied = true;
  }

  releaseEmergencyBreak(): void {
    this.emergencyBreakApplied = false;
  }

  private canAccelerate(): boolean {
    return (
      !this.emergencyBreakApplied &&
      !this.shunting &&
      this.wagon.canThisWagonControl() &&
      (this.wagon.getControlType() !== WagonControlType.ControlCar ||
        this.wagon.getTrain().hasLocomotive())
    );
  }

  private canShunt(): boolean {
    return (
      !this.emergencyBreakApplied &&
      this.wagon.canThisWagonControl() &&
      (this.speed === 0 || this.shunting) &&
      this.wagon.getTrain().hasLocomotive()
    );
  }

  getMovingState(): WagonMovingState {
    return this.shunting
      ? WagonMovingState.Shunting
      : this.speed > 0
        ? WagonMovingState.Moving
        : WagonMovingState.Standing;
  }
}
