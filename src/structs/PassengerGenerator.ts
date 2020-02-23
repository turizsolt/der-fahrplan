import * as BABYLON from 'babylonjs';
import { Passenger } from './Passenger/Passenger';
import { Platform } from './Platform';

export class PassengerGenerator {
  private interval: number;

  constructor(
    readonly platformList: Platform[],
    readonly scene: BABYLON.Scene
  ) {
    this.interval = (setInterval(() => this.tick(), 2000) as unknown) as number;
    this.tick();
  }

  addToList(platform: Platform) {
    this.platformList.push(platform);
  }

  tick() {
    if (this.platformList.length === 0) return;

    if (Math.random() < 0.8) {
      const length = this.platformList.length;
      const fromIdx = (Math.random() * length) | 0;
      const toIdx = (Math.random() * length) | 0;
      if (toIdx !== fromIdx) {
        const passenger = new Passenger(
          this.platformList[toIdx],
          this.platformList[fromIdx]
        );
        this.platformList[fromIdx].addPassenger(passenger);
      }
    }
  }
}
