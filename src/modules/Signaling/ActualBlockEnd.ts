import { DirectedBlock } from './DirectedBlock';
import { BlockEnd } from './BlockEnd';
import { BlockJointEnd } from './BlockJointEnd';
import { Block } from './Block';
import { TYPES } from '../../di/TYPES';

export class ActualBlockEnd implements BlockEnd {
  constructor(
    private start: DirectedBlock,
    private end: DirectedBlock,
    private jointEnd: BlockJointEnd
  ) {}

  getStart(): DirectedBlock {
    return this.start;
  }

  getEnd(): DirectedBlock {
    return this.end;
  }

  getBlock(): Block {
    return this.start.getBlock();
  }

  getJointEnd(): BlockJointEnd {
    return this.jointEnd;
  }

  connect(): void {
    this.jointEnd.joint.setOneEnd(this.jointEnd.end, this);
  }

  disconnect(): void {
    this.jointEnd.joint.removeEnd(this);
  }

  persist(): Object {
    return {
      end: this.jointEnd.end,
      joint: this.jointEnd.joint.getId()
    };
  }

  getType(): Symbol {
    return TYPES.BlockEnd;
  }
}
