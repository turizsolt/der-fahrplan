import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { SignalSignal } from './SignalSignal';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { BlockEnd } from './BlockEnd';
import { SectionEnd } from './SectionEnd';
import { CapacityCap } from './CapacityCap/CapacityCap';

export interface Signal extends BaseBrick {
  init(
    position: PositionOnTrack,
    blockEnd?: BlockEnd,
    sectionEnd?: SectionEnd,
    startSignal?: SignalSignal,
    capacityCap?: CapacityCap
  ): Signal;
  getSignal(): SignalSignal;
  setBlockSignal(signal: SignalSignal): void;
  setHidden(): void;
  addSectionEmitter(sectionEnd: SectionEnd): void;
  addBlockEmitter(blockEnd: BlockEnd): void;
  addCapacityEmitter(capacityCap: CapacityCap): void;
}
