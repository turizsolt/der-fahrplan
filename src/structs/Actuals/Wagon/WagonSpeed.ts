export default class WagonSpeed {
  private speed: number = 0;
  private emergencyBreakApplied: boolean = false;

  constructor(
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
    }
  }

  break(): void {
    if (this.speed > 0) {
      this.speed -= this.accelerateBy;
    } else {
      this.speed = 0;
    }
  }

  shountForward(): void {
    if (this.canAccelerate() && this.speed === 0) {
      this.speed = 1;
    }
  }

  shountBackward(): void {
    if (this.canAccelerate() && this.speed === 0) {
      this.speed = -1;
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
    return !this.emergencyBreakApplied;
  }
}
