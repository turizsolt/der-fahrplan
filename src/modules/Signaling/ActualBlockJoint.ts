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

export interface ActualBlockJoint extends Emitable {}
const doApply = () => applyMixins(ActualBlockJoint, [Emitable]);
export class ActualBlockJoint extends ActualBaseBrick implements BlockJoint {
  private position: PositionOnTrack = null;
  private opposition: PositionOnTrack = null;
  private ends: Record<WhichEnd, BlockEnd>;

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

    this.emit('init', this.persist());
    return this;
  }

  setOneEnd(jointEnd: WhichEnd, blockEnd: BlockEnd): void {
    this.ends[jointEnd] = blockEnd;
    if (this.ends.A && this.ends.B) {
      this.ends.A.getEnd().setNext(this.ends.B.getStart());
      this.ends.B.getEnd().setNext(this.ends.A.getStart());
    }
  }

  removeEnd(blockEnd: BlockEnd) {
    if (this.ends.A === blockEnd) {
      if (this.ends.A && this.ends.B) {
        this.ends.A.getEnd().setNext(null);
        this.ends.B.getEnd().setNext(null);
      }
      this.ends.A = null;
    } else if (this.ends.B === blockEnd) {
      if (this.ends.A && this.ends.B) {
        this.ends.A.getEnd().setNext(null);
        this.ends.B.getEnd().setNext(null);
      }
      this.ends.B = null;
    }
  }

  getEnd(whichEnd: WhichEnd): BlockEnd {
    return this.ends[whichEnd];
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
      ray: this.position.getRay().persist()
    };
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
doApply();
