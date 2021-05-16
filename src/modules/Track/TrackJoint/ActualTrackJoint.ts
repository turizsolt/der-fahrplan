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
  private permaEnds: Record<WhichEnd, TrackEnd[]>;

  init(ray: Ray): TrackJoint {
    super.initStore(TYPES.TrackJoint);

    this.ray = ray;

    this.ends = {
      A: null,
      B: null
    };

    this.permaEnds = {
      A: [],
      B: []
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

  getPermaEnds(whichEnd: WhichEnd): TrackEnd[] {
    return this.permaEnds[whichEnd];
  }

  setPermaOneEnd(jointEnd: WhichEnd, trackEnd: TrackEnd): void {
    this.permaEnds[jointEnd].push(trackEnd);

    if (this.permaEnds.A.length && this.permaEnds.B.length) {
      this.permaEnds.A.map(a =>
        a.getEnd().setPermaNexts(this.permaEnds.B.map(b => b.getStart()))
      );
      this.permaEnds.B.map(b =>
        b.getEnd().setPermaNexts(this.permaEnds.A.map(a => a.getStart()))
      );
    }
  }

  // todo simplify after it has been tested
  removePermaEnd(trackEnd: TrackEnd): void {
    if (this.permaEnds.A.includes(trackEnd)) {
      if (this.permaEnds.A.length && this.permaEnds.B.length) {
        if (this.permaEnds.A.length && this.permaEnds.B.length) {
          this.permaEnds.A.map(a =>
            a.getEnd().setPermaNexts(this.permaEnds.B.map(b => null))
          );
          this.permaEnds.B.map(b =>
            b.getEnd().setPermaNexts(this.permaEnds.A.map(a => null))
          );
        }
      }
      this.permaEnds.A = this.permaEnds.A.filter(x => x !== trackEnd);
      if (this.permaEnds.A.length && this.permaEnds.B.length) {
        this.permaEnds.A.map(a =>
          a.getEnd().setPermaNexts(this.permaEnds.B.map(b => b.getStart()))
        );
        this.permaEnds.B.map(b =>
          b.getEnd().setPermaNexts(this.permaEnds.A.map(a => a.getStart()))
        );
      }
    } else if (this.permaEnds.B.includes(trackEnd)) {
      if (this.permaEnds.A.length && this.permaEnds.B.length) {
        if (this.permaEnds.A.length && this.permaEnds.B.length) {
          this.permaEnds.A.map(a =>
            a.getEnd().setPermaNexts(this.permaEnds.B.map(b => null))
          );
          this.permaEnds.B.map(b =>
            b.getEnd().setPermaNexts(this.permaEnds.A.map(a => null))
          );
        }
      }
      this.permaEnds.B = this.permaEnds.B.filter(x => x !== trackEnd);
      if (this.permaEnds.A.length && this.permaEnds.B.length) {
        this.permaEnds.A.map(a =>
          a.getEnd().setPermaNexts(this.permaEnds.B.map(b => b.getStart()))
        );
        this.permaEnds.B.map(b =>
          b.getEnd().setPermaNexts(this.permaEnds.A.map(a => a.getStart()))
        );
      }
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
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(Ray.from(obj.ray.x, obj.ray.y, obj.ray.z, obj.ray.dirXZ));
  }
}

doApply();
