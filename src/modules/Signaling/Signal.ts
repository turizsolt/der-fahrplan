import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { SignalSignal } from './SignalSignal';

export interface Signal extends BaseBrick {
  init(): Signal;
  getSignal(): SignalSignal;
  setSignal(signal: SignalSignal): void;
}
