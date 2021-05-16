import { DirectedBlock } from './DirectedBlock';
import { TrackDirection } from '../Track/TrackDirection';
import { BlockSegment } from './BlockSegment';
import { Block } from './Block';

export class ActualDirectedBlock implements DirectedBlock {
  private nextBlock: DirectedBlock = null;
  private reverseBlock: DirectedBlock = null;

  constructor(
    private segment: BlockSegment,
    private trackDirection: TrackDirection
  ) {}

  next(): DirectedBlock {
    return this.nextBlock;
  }

  setNext(nextBlock: DirectedBlock): void {
    this.nextBlock = nextBlock;
  }

  reverse(): DirectedBlock {
    return this.reverseBlock;
  }

  setReverse(reverseBlock: DirectedBlock): void {
    this.reverseBlock = reverseBlock;
  }

  getDirection(): TrackDirection {
    return this.trackDirection;
  }

  getBlock(): Block {
    return this.segment.getBlock();
  }
}
