import { TrackDirection } from '../Track/TrackDirection';
import { Block } from './Block';

export interface DirectedBlock {
  next(): DirectedBlock;
  setNext(nextBlock: DirectedBlock): void;

  reverse(): DirectedBlock;
  setReverse(reverseBlock: DirectedBlock): void;

  getDirection(): TrackDirection;
  getBlock(): Block;
}
