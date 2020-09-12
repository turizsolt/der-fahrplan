export default class WagonEngine implements WagonControl {
  private speed: number = 0;
  private emergencyBreakApplied: boolean = false;

  constructor(private maxSpeed: number) {}

  getSpeed(): number {
    return this.speed;
  }

  accelerate(): void {
    if (this.canAccelerate() && this.speed < this.maxSpeed) {
      this.speed++;
    }
  }

  break(): void {
    if (this.speed > 0) {
      this.speed--;
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
