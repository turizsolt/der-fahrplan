import { DirectedBlock } from './DirectedBlock';
import { BlockJointEnd } from './BlockJointEnd';
import { Block } from './Block';
import { Train } from '../Train/Train';
import { Emitable } from '../../mixins/Emitable';
import { SignalSignal } from './SignalSignal';

export interface BlockEnd extends Emitable {
  getStart(): DirectedBlock;
  getEnd(): DirectedBlock;
  getJointEnd(): BlockJointEnd;
  getBlock(): Block;
  connect(): void;
  disconnect(): void;
  persist(): any;
  getType(): Symbol;
  checkin(train: Train): void;
  checkout(train: Train): void;
  getSignal(): SignalSignal;
  setHidden(): void;
  getHash(): string;
}
