import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { SignalSignal } from './SignalSignal';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { BlockEnd } from './BlockEnd';
import { SectionEnd } from './SectionEnd';

export interface Signal extends BaseBrick {
  init(
    position: PositionOnTrack,
    blockEnd?: BlockEnd,
    sectionEnd?: SectionEnd,
    startSignal?: SignalSignal
  ): Signal;
  getSignal(): SignalSignal;
  setBlockSignal(signal: SignalSignal): void;
  setHidden(): void;
}
