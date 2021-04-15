import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { SignalSignal } from './SignalSignal';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { Block } from './Block';

export interface Signal extends BaseBrick {
  init(position: PositionOnTrack, block?: Block): Signal;
  getSignal(): SignalSignal;
  setSignal(signal: SignalSignal): void;
}
