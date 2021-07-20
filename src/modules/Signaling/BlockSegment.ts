import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BlockEnd } from './BlockEnd';
import { DirectedBlock } from './DirectedBlock';
import { TrackDirection } from '../Track/TrackDirection';
import { Block } from './Block';

export interface BlockSegment {
  remove(): void;
  getEnd(whichEnd: WhichEnd): BlockEnd;
  getBlock(): Block;
  getDirected(direction: TrackDirection): DirectedBlock;
  connect(): void;
  disconnect(): void;
  persist(): any;
}
