import { Signal } from './Signal';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { SignalSignal } from './SignalSignal';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { TYPES } from '../../di/TYPES';
import { BlockEnd } from './BlockEnd';
import { BlockJoint } from './BlockJoint';
import { SectionEnd } from './SectionEnd';

export interface ActualSignal extends Emitable {}
const doApply = () => applyMixins(ActualSignal, [Emitable]);
export class ActualSignal extends ActualBaseBrick implements Signal {
  private blockSignal: SignalSignal = SignalSignal.Green;
  private sectionSignal: SignalSignal = SignalSignal.Green;
  private signal: SignalSignal = SignalSignal.Red;
  private hidden: boolean = false;
  private position: PositionOnTrack = null;
  private blockEnd: BlockEnd = null;
  private blockSubscribe: (data: any) => void;
  private sectionEnd: SectionEnd = null;
  private sectionSubscribe: (data: any) => void;

  init(position: PositionOnTrack, blockEnd?: BlockEnd, sectionEnd?: SectionEnd, startSignal?: SignalSignal): Signal {
    this.signal = startSignal || SignalSignal.Red;
    this.initStore(TYPES.Signal);
    this.position = position;
    this.position.getDirectedTrack().addMarker(this.position.getPosition(), {
      type: 'Signal',
      signal: this
    });

    if(sectionEnd) {
      this.addSectionEmitter(sectionEnd);
    }
    if(blockEnd) {
      this.addBlockEmitter(blockEnd);
    }

    this.emit('init', this.persist());
    return this;
  }

  addSectionEmitter(sectionEnd: SectionEnd): void {
    this.sectionSubscribe = (data: any) => {
      this.setSectionSignal(data.signal);
    };
    this.sectionSubscribe.bind(this);
  
    this.sectionEnd = sectionEnd;
    this.sectionEnd?.on('update', this.sectionSubscribe);
  }

  addBlockEmitter(blockEnd: BlockEnd): void {
    this.blockSubscribe = (data: any) => {
      this.setBlockSignal(data.signal);
      if(data.hidden) {
        this.setHidden();
      }
    };
    this.blockSubscribe.bind(this);
  
    this.blockEnd = blockEnd;
    this.blockEnd?.on('update', this.blockSubscribe);
    const blockEndHidden = this.blockEnd?.persist().hidden;
    if(blockEndHidden) { 
      this.hidden = true;
    }
  }

  setHidden(): void {
    this.hidden = true;
    this.emit('update', this.persist());
  }

  getSignal(): SignalSignal {
    return this.blockSignal;
  }

  setBlockSignal(signal: SignalSignal): void {
    this.blockSignal = signal;
    this.setSignal();
  }

  setSectionSignal(signal: SignalSignal): void {
    this.sectionSignal = signal;
    this.setSignal();
  }

  private setSignal() {
    this.signal = (this.blockSignal === SignalSignal.Green 
      && this.sectionSignal === SignalSignal.Green)
      ? SignalSignal.Green
      : SignalSignal.Red;
    this.emit('update', this.persist());
  }

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'Signal',
      signal: this.signal,
      hidden: this.hidden,
      ray: this.position.getRay().persist(),
      positionOnTrack: this.position.persist(),
      blockEnd: this.blockEnd?.persist(),
      sectionEnd: this.sectionEnd?.persist()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    let blockEnd:BlockEnd = undefined;
    if(obj.blockEnd) {
        const joint = store.get(obj.blockEnd.joint) as BlockJoint;
        blockEnd = joint.getEnd(obj.blockEnd.end);
    }
    let sectionEnd:SectionEnd = undefined;
    if(obj.sectionEnd) {
        const joint = store.get(obj.sectionEnd.joint) as BlockJoint;
        sectionEnd = joint.getSectionEnd(obj.sectionEnd.end);
    }
    this.init(PositionOnTrack.fromData(obj.positionOnTrack, store), blockEnd, sectionEnd, obj.signal);
    if(obj.hidden) { this.setHidden(); }
  }

  remove() {
    super.remove();
    this.blockEnd?.off('update', this.blockSubscribe);
    this.sectionEnd?.off('update', this.sectionSubscribe);
  }
}
doApply();
