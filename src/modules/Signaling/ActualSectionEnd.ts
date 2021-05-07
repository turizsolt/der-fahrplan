import { BlockJointEnd } from './BlockJointEnd';
import { TYPES } from '../../di/TYPES';
import { Train } from '../Train/Train';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { SignalSignal } from './SignalSignal';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { TrackDirection } from '../Track/TrackDirection';
import { SectionEnd } from './SectionEnd';
import { Section } from './Section';

export interface ActualSectionEnd extends Emitable {}
const doApply = () => applyMixins(ActualSectionEnd, [Emitable]);
export class ActualSectionEnd implements SectionEnd {
  private signal: SignalSignal = SignalSignal.Red;
  private sectionSubscribe: (data: any) => void;

  constructor(
    private section: Section,
    private whichEnd: WhichEnd,
    private jointEnd: BlockJointEnd
  ) {
    this.sectionSubscribe = (data: any) => this.updateSignal();
    this.sectionSubscribe.bind(this);

    this.section.on('update', this.sectionSubscribe);

    this.updateSignal();
  }

  private updateSignal() {
    this.signal = this.section.isFree(
      this.whichEnd === WhichEnd.A ? TrackDirection.AB : TrackDirection.BA
    )
      ? SignalSignal.Green
      : SignalSignal.Red;
    this.emit('update', this.persist());
  }

  getSignal(): SignalSignal {
    return this.signal;
  }

  getJointEnd(): BlockJointEnd {
    return this.jointEnd;
  }

  connect(): void {
    this.jointEnd.joint.setOneSectionEnd(this.jointEnd.end, this);
  }

  disconnect(): void {
    this.jointEnd.joint.removeSectionEnd(this);
  }

  checkin(train: Train): void {
    this.section.checkin(this.whichEnd, train);
  }

  checkout(train: Train): void {
    this.section.checkout(train);
  }

  persist(): Object {
    return {
      end: this.jointEnd.end,
      joint: this.jointEnd.joint.getId(),
      signal: this.signal
    };
  }

  getType(): Symbol {
    return TYPES.SectionEnd;
  }
}
doApply();
