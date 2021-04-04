import { TYPES } from '../../../di/TYPES';
import { injectable } from 'inversify';
import { TrackJoint } from './TrackJoint';
import { WhichEnd } from '../../../structs/Interfaces/WhichEnd';
import { TrackBase } from '../TrackBase';
import { Ray } from '../../../structs/Geometry/Ray';
import { ActualBaseBrick } from '../../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../../structs/Renderers/BaseRenderer';
import { Store } from '../../../structs/Interfaces/Store';
import { applyMixins } from '../../../mixins/ApplyMixins';
import { Emitable } from '../../../mixins/Emitable';
import { TrackEnd } from '../TrackEnd';

export interface ActualTrackJoint extends Emitable {}
const doApply = () => applyMixins(ActualTrackJoint, [Emitable]);
@injectable()
export class ActualTrackJoint extends ActualBaseBrick implements TrackJoint {
  private ray: Ray;
  private ends: Record<WhichEnd, TrackEnd>;

  init(ray: Ray): TrackJoint {
    super.initStore(TYPES.TrackJoint);

    this.ray = ray;

    this.ends = {
      A: null,
      B: null
    };

    this.emit('init', this.persist());

    return this;
  }

  isRemovable(): boolean {
    return !this.ends.A && !this.ends.B;
  }

  remove() {
    if (this.isRemovable()) {
      this.emit('remove', this.id);
    }
  }

  setOneEnd(jointEnd: WhichEnd, trackEnd: TrackEnd): void {
    this.ends[jointEnd] = trackEnd;
    if (this.ends.A && this.ends.B) {
      this.ends.A.getEnd().setNext(this.ends.B.getStart());
      this.ends.B.getEnd().setNext(this.ends.A.getStart());
    }
  }

  removeEnd(trackEnd: TrackEnd) {
    if (this.ends.A === trackEnd) {
      if (this.ends.A && this.ends.B) {
        this.ends.A.getEnd().setNext(null);
        this.ends.B.getEnd().setNext(null);
      }
      this.ends.A = null;
    } else if (this.ends.B === trackEnd) {
      if (this.ends.A && this.ends.B) {
        this.ends.A.getEnd().setNext(null);
        this.ends.B.getEnd().setNext(null);
      }
      this.ends.B = null;
    }
  }

  getTracksEnd(track: TrackBase): WhichEnd | undefined {
    if (this.ends.A && this.ends.A.getTrack() === track) return WhichEnd.A;
    if (this.ends.B && this.ends.B.getTrack() === track) return WhichEnd.B;
    return undefined;
  }

  getRay() {
    return this.ray;
  }

  getPosition() {
    return this.getRay().coord;
  }

  getRotation() {
    return this.getRay().dirXZ;
  }

  getEnd(whichEnd: WhichEnd): TrackEnd {
    return this.ends[whichEnd];
  }

  getRenderer(): BaseRenderer {
    return null;
  }

  persist(): Object {
    return {
      id: this.getId(),
      type: 'TrackJoint',

      ray: this.ray.persist()
      // A
      // B
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(Ray.from(obj.ray.x, obj.ray.y, obj.ray.z, obj.ray.dirXZ));

    const trA: TrackBase = obj.A ? (store.get(obj.A.track) as TrackBase) : null;
    const trB: TrackBase = obj.B ? (store.get(obj.B.track) as TrackBase) : null;

    // if (obj.A) {
    //   this.setOneEnd(WhichEnd.A, trA.getEnd(obj.A.whichEnd));
    // }

    // if (obj.B) {
    //   this.setOneEnd(WhichEnd.B, trB.getEnd(obj.B.whichEnd));
    // }
  }
}

doApply();
