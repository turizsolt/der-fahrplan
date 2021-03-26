import { TrackJointRenderer } from '../../Renderers/TrackJointRenderer';
import { Coordinate } from '../../Geometry/Coordinate';
import { TYPES } from '../../../di/TYPES';
import { TrackJointEnd } from './TrackJointEnd';
import { inject, injectable } from 'inversify';
import { TrackJoint } from '../../Interfaces/TrackJoint';
import { WhichEnd, otherEnd } from '../../Interfaces/WhichEnd';
import { TrackEnd } from '../Track/TrackEnd';
import { TrackBase } from '../../Interfaces/TrackBase';
import { Ray } from '../../Geometry/Ray';
import { TrackJointConnector } from './TrackJointConnector';
import { ActualBaseBrick } from '../ActualBaseBrick';
import { BaseRenderer } from '../../Renderers/BaseRenderer';
import { Store } from '../../Interfaces/Store';

@injectable()
export class ActualTrackJoint extends ActualBaseBrick implements TrackJoint {
  private ray: Ray;
  private removed: boolean = false;
  private ends: Record<WhichEnd, TrackJointEnd>;

  @inject(TYPES.TrackJointRenderer) private renderer: TrackJointRenderer;
  @inject(TYPES.FactoryOfTrackJointConnector)
  TrackJointConnectorFactory: () => TrackJointConnector;
  private connector: TrackJointConnector;

  init(x: number, z: number, rot: number): TrackJoint {
    super.initStore(TYPES.TrackJoint);

    this.connector = this.TrackJointConnectorFactory();
    this.connector.setStore(this.store);

    this.ends = {
      A: new TrackJointEnd(),
      B: new TrackJointEnd()
    };

    this.ray = new Ray(new Coordinate(x, 0, z), rot);

    this.renderer.init(this);
    return this;
  }

  rotate(rot: number) {
    if (ActualTrackJoint.areBothEndsEmpty(this.ends.A, this.ends.B)) {
      this.ray.dirXZ = rot;
      this.renderer.update();
    }
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
      this.removed = true;
      this.renderer.remove();

      this.store.unregister(this);
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

  static isEndEmpty(end: TrackJointEnd): boolean {
    return !end.isSet();
  }

  connect(other: TrackJoint): any {
    return this.connector.connect(this, other);
  }

  static areBothEndsEmpty(oneEnd, otherEnd: TrackJointEnd): boolean {
    return ActualTrackJoint.isEndEmpty(oneEnd) && ActualTrackJoint.isEndEmpty(otherEnd);
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

  isRemoved(): boolean {
    return this.removed;
  }

  verbose(): void {
    // console.log('joint ', this.id);
    // console.log('A ', this.ends.A.end && this.ends.A.end.getHash());
    // console.log('B ', this.ends.B.end && this.ends.B.end.getHash());
    // console.log('/joint');
  }

  getRenderer(): BaseRenderer {
    return this.renderer;
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
    this.init(obj.ray.x, obj.ray.z, obj.ray.dirXZ);

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
