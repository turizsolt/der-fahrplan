import { DirectedBlock } from './DirectedBlock';
import { BlockEnd } from './BlockEnd';
import { BlockJointEnd } from './BlockJointEnd';
import { Block } from './Block';
import { PathBlockEnd } from './PathBlockEnd';
import { PathBlock } from './PathBlock';
import { TYPES } from '../../di/TYPES';
import { Train } from '../Train/Train';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { SignalSignal } from './SignalSignal';
import { otherEnd, WhichEnd } from '../../structs/Interfaces/WhichEnd';

export interface ActualPathBlockEnd extends Emitable { }
const doApply = () => applyMixins(ActualPathBlockEnd, [Emitable]);
export class ActualPathBlockEnd implements PathBlockEnd {
  private blockEnd: BlockEnd = null;
  private signal: SignalSignal = SignalSignal.Red;
  private blockSubscribe: (data: any) => void;

  constructor(
    private jointEnd: BlockJointEnd,
    private pathBlock: PathBlock
  ) {
    this.blockSubscribe = (data: any) => this.updateSignal();
    this.blockSubscribe.bind(this);

    const other = this.jointEnd.joint.getEnd(this.jointEnd.end === WhichEnd.A ? WhichEnd.B : WhichEnd.A);
    other?.setHidden();

    this.updateSignal();
  }

  setGreen() {
    this.signal = SignalSignal.Green;
    this.emit('update', this.persist());
  }

  private updateSignal() {
    if (this.signal !== SignalSignal.Green) return;

    let newSignal = SignalSignal.Green;
    if (this.blockEnd) {
      if (!this.blockEnd.getBlock().isFree()) {
        newSignal = SignalSignal.Red;
      }
    } else {
      newSignal = SignalSignal.Red;
    }

    this.signal = newSignal;
    this.emit('update', this.persist());
  }

  getSignal(): SignalSignal {
    return this.signal;
  }

  setBlockEnd(blockEnd: BlockEnd): void {
    if (this.blockEnd) {
      this.getBlock().off('update', this.blockSubscribe);
    }
    this.blockEnd = blockEnd;
    if (this.blockEnd) {
      this.getBlock().on('update', this.blockSubscribe);
    }
    this.updateSignal();
  }

  setHidden(): void { }

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

  getOtherEnd(): BlockEnd {
    return this.jointEnd.joint.getEnd(otherEnd(this.jointEnd.end));
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
    this.blockEnd?.checkin(train);
  }

  checkout(train: Train): void {
    this.pathBlock.checkout(this);
    this.blockEnd?.checkout(train);
  }

  getHash(): string {
    return this.jointEnd.joint.getId() + '-' + this.jointEnd.end + '-Path';
  }

  persist(): Object {
    return {
      end: this.jointEnd.end,
      joint: this.jointEnd.joint.getId(),
      signal: this.signal,
      hidden: false
    };
  }

  getType(): Symbol {
    return TYPES.PathBlockEnd;
  }
}
doApply();
