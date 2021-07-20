import { BlockJointEnd } from './BlockJointEnd';
import { Train } from '../Train/Train';
import { Emitable } from '../../mixins/Emitable';
import { SignalSignal } from './SignalSignal';
import { Section } from './Section';

export interface SectionEnd extends Emitable {
  getJointEnd(): BlockJointEnd;
  connect(): void;
  disconnect(): void;
  persist(): any;
  getType(): Symbol;
  checkin(train: Train): void;
  checkout(train: Train): void;
  getSignal(): SignalSignal;
  getSection(): Section;
}
