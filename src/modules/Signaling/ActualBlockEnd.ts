import { DirectedBlock } from './DirectedBlock';
import { BlockEnd } from './BlockEnd';
import { BlockJointEnd } from './BlockJointEnd';

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
}
