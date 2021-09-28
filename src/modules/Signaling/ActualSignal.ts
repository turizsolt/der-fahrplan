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
import { CapacityCap } from './CapacityCap/CapacityCap';

export interface ActualSignal extends Emitable { }
const doApply = () => applyMixins(ActualSignal, [Emitable]);
export class ActualSignal extends ActualBaseBrick implements Signal {
  private blockSignal: SignalSignal = SignalSignal.Green;
  private sectionSignal: SignalSignal = SignalSignal.Green;
  private capacitySignal: SignalSignal = SignalSignal.Green;
  private signal: SignalSignal = SignalSignal.Red;
  private hidden: boolean = false;
  private position: PositionOnTrack = null;
  private blockEnd: BlockEnd = null;
  private blockSubscribe: (data: any) => void;
  private sectionEnd: SectionEnd = null;
  private sectionSubscribe: (data: any) => void;
  private capacityCap: CapacityCap = null;
  private capacitySubscribe: (data: any) => void;

  init(position: PositionOnTrack, blockEnd?: BlockEnd, sectionEnd?: SectionEnd, startSignal?: SignalSignal,
    capacityCap?: CapacityCap): Signal {
    this.signal = startSignal || SignalSignal.Red;
    this.initStore(TYPES.Signal);
    this.position = position;
    this.position.getDirectedTrack().addMarker(this.position.getPosition(), {
      type: 'Signal',
      signal: this
    });

    if (sectionEnd) {
      this.addSectionEmitter(sectionEnd);
    }
    if (blockEnd) {
      this.addBlockEmitter(blockEnd);
    }
    if (capacityCap) {
      this.addCapacityEmitter(capacityCap);
    }

    this.emit('init', this.persist());
    return this;
  }

  remove() {
    this.blockEnd?.off('update', this.blockSubscribe);
    this.sectionEnd?.off('update', this.sectionSubscribe);
    this.capacityCap?.off('update', this.capacitySubscribe);
    this.emit('remove', this.id);
    super.remove();
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
      if (data.hidden) {
        this.setHidden();
      }
    };
    this.blockSubscribe.bind(this);

    this.blockEnd = blockEnd;
    this.blockEnd?.on('update', this.blockSubscribe);
    const blockEndHidden = this.blockEnd?.persist().hidden;
    if (blockEndHidden) {
      this.hidden = true;
    }
  }


  addCapacityEmitter(capacityCap: CapacityCap): void {
    this.capacitySubscribe = (data: any) => {
      this.setCapacitySignal(data.signal);
    };
    this.capacitySubscribe.bind(this);

    this.capacityCap = capacityCap;
    this.capacityCap?.on('update', this.capacitySubscribe);
  }

  setHidden(): void {
    this.hidden = true;
    this.emit('update', this.persist());
  }

  getSignal(): SignalSignal {
    return this.signal;
  }

  setBlockSignal(signal: SignalSignal): void {
    this.blockSignal = signal;
    this.setSignal();
  }

  setSectionSignal(signal: SignalSignal): void {
    this.sectionSignal = signal;
    this.setSignal();
  }

  setCapacitySignal(signal: SignalSignal): void {
    this.capacitySignal = signal;
    this.setSignal();
  }

  private setSignal() {
    this.signal = (this.blockSignal === SignalSignal.Green
      && this.sectionSignal === SignalSignal.Green
      && this.capacitySignal === SignalSignal.Green)
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
      sectionEnd: this.sectionEnd?.persist(),
      capacityCap: this.capacityCap?.getId()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    let blockEnd: BlockEnd = undefined;
    if (obj.blockEnd) {
      const joint = store.get(obj.blockEnd.joint) as BlockJoint;
      blockEnd = joint.getEnd(obj.blockEnd.end);
    }
    let sectionEnd: SectionEnd = undefined;
    if (obj.sectionEnd) {
      const joint = store.get(obj.sectionEnd.joint) as BlockJoint;
      sectionEnd = joint.getSectionEnd(obj.sectionEnd.end);
    }
    let capacityCap: CapacityCap = undefined;
    if (obj.capacityCap) {
      capacityCap = store.get(obj.capacityCap) as CapacityCap;
    }
    this.init(PositionOnTrack.fromData(obj.positionOnTrack, store), blockEnd, sectionEnd, obj.signal, capacityCap);
    if (obj.hidden) { this.setHidden(); }
  }
}
doApply();
