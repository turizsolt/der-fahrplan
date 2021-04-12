import { SpeedPedal } from './SpeedPedal';
import { TrainSpeed } from './TrainSpeed';

export class ActualTrainSpeed implements TrainSpeed {
  private speed: number = 0;
  private accelerateBy: number = 0.015625;
  private topSpeed: number = 3;
  private shuntingSpeed: number = 1;
  private allowedSpeed: number = 3;
  private shunting: boolean = false;
  private pedal: SpeedPedal = SpeedPedal.Neutral;

  constructor(private canAccelerate: () => boolean) {}

  setShunting(shunting: boolean): void {
    if (this.speed !== 0) return;
    this.shunting = shunting;
    this.allowedSpeed = shunting ? this.shuntingSpeed : this.topSpeed;
  }

  isShunting(): boolean {
    return this.shunting;
  }

  setPedal(pedal: SpeedPedal): void {
    this.pedal = pedal;
  }

  getSpeed(): number {
    return this.speed;
  }

  getPedal(): SpeedPedal {
    return this.pedal;
  }

  tick(): void {
    switch (this.pedal) {
      case SpeedPedal.Throttle:
        if (this.canAccelerate()) {
          this.accelerate();
        }
        break;

      case SpeedPedal.Brake:
        this.brake();
        break;
    }
  }

  private accelerate(): void {
    this.speed = Math.min(this.allowedSpeed, this.speed + this.accelerateBy);
  }

  private brake(): void {
    this.speed = Math.max(0, this.speed - this.accelerateBy);
  }
}
