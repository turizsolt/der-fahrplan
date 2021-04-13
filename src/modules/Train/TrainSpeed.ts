import { SpeedPedal } from './SpeedPedal';

export interface TrainSpeed {
  isShunting(): boolean;
  setShunting(shunting: boolean): void;
  getSpeed(): number;
  setPedal(pedal: SpeedPedal): void;
  getPedal(): SpeedPedal;
  tick(): void;
  persist(): any;
  load(data: any): void;
}
