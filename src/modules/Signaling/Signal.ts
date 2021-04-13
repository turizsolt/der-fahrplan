import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { SignalSignal } from './SignalSignal';
import { PositionOnTrack } from '../Train/PositionOnTrack';

export interface Signal extends BaseBrick {
  init(position: PositionOnTrack): Signal;
  getSignal(): SignalSignal;
  setSignal(signal: SignalSignal): void;
}
