import { DirectedBlock } from './DirectedBlock';
import { BlockEnd } from './BlockEnd';
import { BlockJointEnd } from './BlockJointEnd';
import { Block } from './Block';
import { TYPES } from '../../di/TYPES';
import { Train } from '../Train/Train';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { SignalSignal } from './SignalSignal';

export interface ActualBlockEnd extends Emitable {}
const doApply = () => applyMixins(ActualBlockEnd, [Emitable]);
export class ActualBlockEnd implements BlockEnd {
  private signal: SignalSignal = SignalSignal.Red;
  private blockSubscribe: (data: any) => void;

  constructor(
    private start: DirectedBlock,
    private end: DirectedBlock,
    private jointEnd: BlockJointEnd
  ) {
    this.blockSubscribe = (data: any) => this.updateSignal();
    this.blockSubscribe.bind(this);

    this.getBlock().on('update', this.blockSubscribe);
    this.updateSignal();
  }

  private updateSignal() {
    this.signal = this.getBlock().isFree() ? SignalSignal.Green : SignalSignal.Red;
    this.emit('update', this.persist());
  }

  getSignal(): SignalSignal {
    return this.signal;
  }

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

  checkin(train: Train): void {
    console.log('block checkin', this.getBlock()?.getId());
    this.getBlock()?.checkin(train);
  }

  checkout(train: Train): void {
    console.log('block checkout', this.getBlock()?.getId());
    this.getBlock()?.checkout(train);
  }

  persist(): Object {
    return {
      end: this.jointEnd.end,
      joint: this.jointEnd.joint.getId(),
      signal: this.signal
    };
  }

  getType(): Symbol {
    return TYPES.BlockEnd;
  }
}
doApply();
