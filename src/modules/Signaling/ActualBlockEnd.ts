import { DirectedBlock } from './DirectedBlock';
import { BlockEnd } from './BlockEnd';
import { BlockJointEnd } from './BlockJointEnd';
import { Block } from './Block';
import { TYPES } from '../../di/TYPES';
import { Train } from '../Train/Train';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { SignalSignal } from './SignalSignal';
import { otherEnd, WhichEnd } from '../../structs/Interfaces/WhichEnd';

export interface ActualBlockEnd extends Emitable { }
const doApply = () => applyMixins(ActualBlockEnd, [Emitable]);
export class ActualBlockEnd implements BlockEnd {
  private signal: SignalSignal = SignalSignal.Red;
  private hidden: boolean = false;
  private blockSubscribe: (data: any) => void;

  constructor(
    private start: DirectedBlock,
    private end: DirectedBlock,
    private jointEnd: BlockJointEnd
  ) {
    this.blockSubscribe = (data: any) => this.updateSignal();
    this.blockSubscribe.bind(this);

    this.getBlock().on('update', this.blockSubscribe);

    const other = this.jointEnd.joint.getEnd(this.jointEnd.end === WhichEnd.A ? WhichEnd.B : WhichEnd.A);
    if (other) {
      this.hidden = other.getType() === TYPES.PathBlockEnd;
    }

    this.updateSignal();
  }

  getHash(): string {
    return this.jointEnd.joint.getId() + '-' + this.jointEnd.end;
  }

  setHidden(): void {
    this.hidden = true;
    this.emit('update', this.persist());
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

  getOtherEnd(): BlockEnd {
    return this.jointEnd.joint.getEnd(otherEnd(this.jointEnd.end));
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
    this.getBlock()?.checkin(train);
  }

  checkout(train: Train): void {
    this.getBlock()?.checkout(train);
  }

  persist(): Object {
    return {
      end: this.jointEnd.end,
      joint: this.jointEnd.joint.getId(),
      signal: this.signal,
      hidden: this.hidden
    };
  }

  getType(): Symbol {
    return TYPES.BlockEnd;
  }
}
doApply();
