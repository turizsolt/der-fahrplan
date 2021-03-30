import { TYPES } from '../../../di/TYPES';
import { TrackJointEnd } from './TrackJointEnd';
import { injectable } from 'inversify';
import { TrackJoint } from './TrackJoint';
import { WhichEnd, otherEnd } from '../../../structs/Interfaces/WhichEnd';
import { TrackEnd } from '../TrackEnd';
import { TrackBase } from '../TrackBase';
import { Ray } from '../../../structs/Geometry/Ray';
import { ActualBaseBrick } from '../../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../../structs/Renderers/BaseRenderer';
import { Store } from '../../../structs/Interfaces/Store';
import { Coordinate } from '../../../structs/Geometry/Coordinate';
import { applyMixins } from '../../../mixins/ApplyMixins';
import { Emitable } from '../../../mixins/Emitable';
import { ActualTrackEnd } from '../ActualTrackEnd';

export interface ActualTrackJoint extends Emitable { }
const doApply = () => applyMixins(ActualTrackJoint, [Emitable]);
@injectable()
export class ActualTrackJoint extends ActualBaseBrick implements TrackJoint {
  private ray: Ray;
  private ends: Record<WhichEnd, TrackJointEnd>;
  private ends2: Record<WhichEnd, ActualTrackEnd>;

  init(ray: Ray): TrackJoint {
    super.initStore(TYPES.TrackJoint);

    this.ray = ray ?? new Ray(new Coordinate(0, 0, 0), 0);

    this.ends = {
      A: new TrackJointEnd(),
      B: new TrackJointEnd()
    };

    this.ends2 = {
      A: null,
      B: null
    };

    this.emit('init', this.persist());

    return this;
  }

  isRemovable(): boolean {
    var removable = true;
    if (this.ends.A.isSet()) {
      removable = removable && this.ends.A.track.isRemovable();
    }
    if (this.ends.B.isSet()) {
      removable = removable && this.ends.B.track.isRemovable();
    }
    return removable;
  }

  // todo what remove what
  remove() {
    if (this.isRemovable()) {
      if (this.ends.A.isSet()) {
        this.ends.A.track.remove();
        this.ends.A.unsetEnd();
      }
      if (this.ends.B.isSet()) {
        this.ends.B.track.remove();
        this.ends.B.unsetEnd();
      }
      this.emit('remove', this.id);

      return true;
    }
    return false;
  }

  removeEnd(end: TrackEnd) {
    if (this.ends.A.end === end) {
      this.ends.A.unsetEnd();
    }
    if (this.ends.B.end === end) {
      this.ends.B.unsetEnd();
    }
  }

  setOneEnd(jointEndLetter: WhichEnd, trackEnd: TrackEnd) {
    const track = trackEnd.getEndOf();
    this.ends[jointEndLetter].setEnd(track, trackEnd);
    if (this.ends[otherEnd(jointEndLetter)].isSet()) {
      this.ends.A.end.connect(this.ends.B.end, this);
    } else {
      this.ends[jointEndLetter].end.setJointTo(this);
    }
  }

  setOneEndx(jointEnd: WhichEnd, trackEnd: ActualTrackEnd): void {
    this.ends2[jointEnd] = trackEnd;
    if (this.ends2.A && this.ends2.B) {
      this.ends2.A.getEnd().setNext(this.ends2.B.getStart());
      this.ends2.B.getEnd().setNext(this.ends2.A.getStart());
    }
  }

  removeEndx(trackEnd: ActualTrackEnd) {
    if (this.ends2.A === trackEnd) {
      if (this.ends2.A && this.ends2.B) {
        this.ends2.A.getEnd().setNext(null);
        this.ends2.B.getEnd().setNext(null);
      }
      this.ends2.A = null;
    } else if (this.ends2.B === trackEnd) {
      if (this.ends2.A && this.ends2.B) {
        this.ends2.A.getEnd().setNext(null);
        this.ends2.B.getEnd().setNext(null);
      }
      this.ends2.B = null;
    }
  }

  getTracksEnd(track: TrackBase): WhichEnd | undefined {
    if (this.ends.A.track === track) return WhichEnd.A;
    if (this.ends.B.track === track) return WhichEnd.B;
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

  getEnds() {
    return this.ends;
  }

  getRenderer(): BaseRenderer {
    return null;
  }

  persist(): Object {
    return {
      id: this.getId(),
      type: 'TrackJoint',

      ray: this.ray.persist(),
      A: this.ends.A.isSet()
        ? {
          track: this.ends.A.track.getId(),
          whichEnd: this.ends.A.end.getWhichTrackEnd()
        }
        : null,
      B: this.ends.B.isSet()
        ? {
          track: this.ends.B.track.getId(),
          whichEnd: this.ends.B.end.getWhichTrackEnd()
        }
        : null
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(Ray.from(obj.ray.x, obj.ray.y, obj.ray.z, obj.ray.dirXZ));

    const trA: TrackBase = obj.A ? (store.get(obj.A.track) as TrackBase) : null;
    const trB: TrackBase = obj.B ? (store.get(obj.B.track) as TrackBase) : null;

    if (obj.A) {
      this.setOneEnd(WhichEnd.A, trA.getEnd(obj.A.whichEnd));
    }

    if (obj.B) {
      this.setOneEnd(WhichEnd.B, trB.getEnd(obj.B.whichEnd));
    }
  }
}

doApply();
