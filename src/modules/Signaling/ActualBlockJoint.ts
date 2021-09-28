import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { Emitable } from '../../mixins/Emitable';
import { applyMixins } from '../../mixins/ApplyMixins';
import { TYPES } from '../../di/TYPES';
import { BlockJoint } from './BlockJoint';
import { PositionOnTrack } from '../Train/PositionOnTrack';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BlockEnd } from './BlockEnd';
import { SectionEnd } from './SectionEnd';
import { CapacityCap } from './CapacityCap/CapacityCap';

export interface ActualBlockJoint extends Emitable { }
const doApply = () => applyMixins(ActualBlockJoint, [Emitable]);
export class ActualBlockJoint extends ActualBaseBrick implements BlockJoint {
  private position: PositionOnTrack = null;
  private opposition: PositionOnTrack = null;
  private ends: Record<WhichEnd, BlockEnd>;
  private sectionEnds: Record<WhichEnd, SectionEnd>;
  private capacityCaps: Record<WhichEnd, CapacityCap>;

  init(position: PositionOnTrack): BlockJoint {
    this.initStore(TYPES.BlockJoint);

    this.position = position;
    this.opposition = position.opposition();

    this.position.addMarker({ type: 'BlockJoint', blockJoint: this });
    this.opposition.addMarker({ type: 'BlockJoint', blockJoint: this });

    this.ends = {
      A: null,
      B: null
    };

    this.sectionEnds = {
      A: null,
      B: null
    };

    this.capacityCaps = {
      A: null,
      B: null
    }

    this.emit('init', this.persist());
    return this;
  }

  remove() {
    if (this.getEnd(WhichEnd.A)) return;
    if (this.getEnd(WhichEnd.B)) return;
    if (this.getSectionEnd(WhichEnd.A)) return;
    if (this.getSectionEnd(WhichEnd.B)) return;
    if (this.getCapacityCap(WhichEnd.A)) return;
    if (this.getCapacityCap(WhichEnd.B)) return;

    this.position.removeMarker({ type: 'BlockJoint', blockJoint: this });
    this.opposition.removeMarker({ type: 'BlockJoint', blockJoint: this });
    this.emit('remove', this.id);
    super.remove();
  }

  setOneEnd(jointEnd: WhichEnd, blockEnd: BlockEnd): void {
    this.ends[jointEnd] = blockEnd;
    if (this.ends.A && this.ends.B) {
      this.ends.A.getEnd()?.setNext(this.ends.B.getStart());
      this.ends.B.getEnd()?.setNext(this.ends.A.getStart());
    }
  }

  removeEnd(blockEnd: BlockEnd) {
    if (this.ends.A === blockEnd) {
      if (this.ends.A && this.ends.B) {
        this.ends.A.getEnd()?.setNext(null);
        this.ends.B.getEnd()?.setNext(null);
      }
      this.ends.A = null;
    } else if (this.ends.B === blockEnd) {
      if (this.ends.A && this.ends.B) {
        this.ends.A.getEnd()?.setNext(null);
        this.ends.B.getEnd()?.setNext(null);
      }
      this.ends.B = null;
    }
  }

  setOneSectionEnd(jointEnd: WhichEnd, sectionEnd: SectionEnd): void {
    this.sectionEnds[jointEnd] = sectionEnd;
  }

  removeSectionEnd(sectionEnd: SectionEnd): void {
    if (this.sectionEnds[WhichEnd.A] === sectionEnd) {
      this.sectionEnds[WhichEnd.A] = null;
    } else if (this.sectionEnds[WhichEnd.B] === sectionEnd) {
      this.sectionEnds[WhichEnd.B] = null;
    }
  }

  setOneCapacityCap(jointEnd: WhichEnd, capacityCap: CapacityCap): void {
    this.capacityCaps[jointEnd] = capacityCap;
  }

  // todo third repetition is this
  removeCapacityCap(capacityCap: CapacityCap): void {
    if (this.capacityCaps[WhichEnd.A] === capacityCap) {
      this.capacityCaps[WhichEnd.A] = null;
    } else if (this.capacityCaps[WhichEnd.B] === capacityCap) {
      this.capacityCaps[WhichEnd.B] = null;
    }
  }

  getEnd(whichEnd: WhichEnd): BlockEnd {
    return this.ends[whichEnd];
  }

  getSectionEnd(whichEnd: WhichEnd): SectionEnd {
    return this.sectionEnds[whichEnd];
  }

  getCapacityCap(whichEnd: WhichEnd): CapacityCap {
    return this.capacityCaps[whichEnd];
  }

  getPosition(): PositionOnTrack {
    return this.position;
  }

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'BlockJoint',
      ray: this.position.getRay().persist(), // only for visuals
      positionOnTrack: this.position.persist()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(PositionOnTrack.fromData(obj.positionOnTrack, store));
  }
}
doApply();
