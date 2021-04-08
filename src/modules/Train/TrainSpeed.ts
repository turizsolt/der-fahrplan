import { SpeedPedal } from './SpeedPedal';

export interface TrainSpeed {
  isShunting();
  setShunting(shunting: boolean);
  getSpeed();
  setPedal(pedal: SpeedPedal);
  tick(): void;
}
