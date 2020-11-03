import { WagonMovingState } from './WagonMovingState';
import WagonSpeed from './WagonSpeed';

export default class WagonSpeedPassenger extends WagonSpeed {
  accelerate(): void {}

  break(): void {}

  shountForward(): void {}

  shountBackward(): void {}

  tick(): void {}

  emergencyBreak(): void {}

  releaseEmergencyBreak(): void {}

  getMovingState(): WagonMovingState {
    return WagonMovingState.Standing;
  }
}
