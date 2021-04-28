import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { SignalSignal } from './SignalSignal';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { BlockEnd } from './BlockEnd';

export interface Signal extends BaseBrick {
  init(
    position: PositionOnTrack,
    blockEnd?: BlockEnd,
    startSignal?: SignalSignal
  ): Signal;
  getSignal(): SignalSignal;
  setSignal(signal: SignalSignal): void;
  setHidden(): void;
}
