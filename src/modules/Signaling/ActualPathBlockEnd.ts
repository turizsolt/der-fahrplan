import { DirectedBlock } from './DirectedBlock';
import { BlockEnd } from './BlockEnd';
import { BlockJointEnd } from './BlockJointEnd';
import { Block } from './Block';
import { PathBlockEnd } from './PathBlockEnd';
import { PathBlock } from './PathBlock';
import { TYPES } from '../../di/TYPES';
import { Train } from '../Train/Train';

export class ActualPathBlockEnd implements PathBlockEnd {
  private blockEnd: BlockEnd = null;

  constructor(
    private jointEnd: BlockJointEnd,
    private pathBlock: PathBlock
  ) {}

  setBlockEnd(blockEnd: BlockEnd): void {
      this.blockEnd = blockEnd;
  }

  getPathBlock(): PathBlock {
      return this.pathBlock;
  }

  getStart(): DirectedBlock {
    return this.blockEnd?.getStart();
  }

  getEnd(): DirectedBlock {
    return this.blockEnd?.getEnd();
  }

  getBlock(): Block {
    return this.blockEnd?.getStart().getBlock();
  }

  getJointEnd(): BlockJointEnd {
    return this.jointEnd;
  }

  pathConnect(): void {
    this.jointEnd.joint.setOneEnd(this.jointEnd.end, this);
  }

  connect(): void {
    this.jointEnd.joint.setOneEnd(this.jointEnd.end, this.blockEnd);
  }

  disconnect(): void {
    this.jointEnd.joint.removeEnd(this.blockEnd);
  }

  checkin(train: Train): void {
    console.log('PBE checkin', this.getBlock()?.getId());
    //this.getBlock()?.checkin(train);
    this.blockEnd?.checkin(train);
  }

  checkout(train: Train): void{
    console.log('PBE checkout', this.getBlock()?.getId());
    //this.getBlock()?.checkout(train);
    this.pathBlock.checkout(this);
    this.blockEnd?.checkout(train);
  }

  persist(): Object {
    return {
      end: this.jointEnd.end,
      joint: this.jointEnd.joint.getId()
    };
  }

  getType(): Symbol {
      return TYPES.PathBlockEnd;
  }
}
