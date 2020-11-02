import { WagonMovingState } from './WagonMovingState';
import { Wagon } from '../../Interfaces/Wagon';

export default class WagonSpeed {
  private speed: number = 0;
  private emergencyBreakApplied: boolean = false;
  private shunting: boolean = false;

  constructor(
    private wagon: Wagon,
    private maxSpeed: number = 3,
    private accelerateBy: number = 0.25
  ) {}

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
      this.speed += this.accelerateBy;
      this.wagon.setControlingWagon(this.wagon);
    }
  }

  break(): void {
    if (this.speed > this.accelerateBy) {
      this.speed -= this.accelerateBy;
    } else {
      this.speed = 0;
      this.wagon.clearControlingWagon();
    }
    this.shunting = false;
  }

  shountForward(): void {
    if (this.canAccelerate() && this.speed === 0) {
      this.speed = 1;
      this.shunting = true;
    }
  }

  shountBackward(): void {
    if (this.canAccelerate() && this.speed === 0) {
      this.speed = -1;
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
      this.wagon.canThisWagonControl()
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
