import { TrackJointRenderer } from './TrackJointRenderer';
import { Coordinate } from '../Geometry/Coordinate';
import { TYPES } from '../TYPES';
import { Track } from '../Track/Track';
import { TrackJointEnd } from './TrackJointEnd';
import { inject, injectable } from 'inversify';
import { TrackJoint } from './TrackJoint';
import { TrackSwitch } from '../TrackSwitch/TrackSwitch';
import { WhichEnd, otherEnd } from '../Track/WhichEnd';
import { TrackEnd } from '../Track/TrackEnd';
import { TrackBase } from '../TrackBase/TrackBase';
import { Store } from '../Store/Store';

@injectable()
export class ActualTrackJoint implements TrackJoint {
  private id: string;
  private position: Coordinate;
  private rotation: number;
  private removed: boolean = false;
  private ends: Record<WhichEnd, TrackJointEnd>;
  private selected: boolean = false;

  @inject(TYPES.TrackJointRenderer) private renderer: TrackJointRenderer;
  @inject(TYPES.FactoryOfTrack) TrackFactory: () => Track;
  @inject(TYPES.FactoryOfTrackSwitch) TrackSwitchFactory: () => TrackSwitch;

  @inject(TYPES.FactoryOfStore) StoreFactory: () => Store;
  private store: Store;

  init(x: number, z: number, rot: number): TrackJoint {
    this.store = this.StoreFactory();
    this.id = this.store.register(this);

    this.ends = {
      A: new TrackJointEnd(),
      B: new TrackJointEnd()
    };

    this.position = new Coordinate(x, 0, z);
    this.rotation = rot;

    this.renderer.init(this);
    return this;
  }

  rotate(rot: number) {
    if (this.areBothEndsEmpty(this.ends.A, this.ends.B)) {
      this.rotation = rot;
      this.renderer.update();
    }
  }

  remove() {
    this.removed = true;
    this.renderer.update();
  }

  slope() {
    if (
      almost(this.rotation % Math.PI, Math.PI / 2) ||
      almost(this.rotation % Math.PI, -Math.PI / 2)
    ) {
      return Infinity;
    }
    return Math.tan(this.rotation);
  }

  equ() {
    return this.slope() !== Infinity
      ? {
          a: this.slope(),
          b: this.position.x - this.slope() * this.position.z
        }
      : {
          a: this.slope(),
          z: this.position.z
        };
  }

  computeMidpoint(joint: TrackJoint): undefined | false | Coordinate {
    const e1 = this.equ();
    const e2 = joint.equ();

    if (e1.a === Infinity && e2.a === Infinity)
      return almost(e1.z, e2.z) ? undefined : false;

    if (e1.a === Infinity) {
      const x = e2.a * e1.z + e2.b;
      const z = e1.z;
      return new Coordinate(x, 0, z);
    }

    if (e2.a === Infinity) {
      const x = e1.a * e2.z + e1.b;
      const z = e2.z;
      return new Coordinate(x, 0, z);
    }

    if (almost(e1.a, e2.a)) {
      return almost(e1.b, e2.b) ? undefined : false;
    }

    const z = (e2.b - e1.b) / (e1.a - e2.a);
    const x = e1.a * z + e1.b;
    return new Coordinate(x, 0, z);
  }

  whichEnd(one: TrackJoint, w: any, other: TrackJoint): WhichEnd {
    const comparePosition = w === undefined ? other.getPosition() : w;
    const direction = Math.atan2(
      comparePosition.x - one.getPosition().x,
      comparePosition.z - one.getPosition().z
    );
    return almost(direction, one.getRotation()) ? WhichEnd.B : WhichEnd.A;
  }

  isEndEmpty(end: TrackJointEnd): boolean {
    return !end.isSet();
  }

  areBothEndsEmpty(oneEnd, otherEnd: TrackJointEnd): boolean {
    return this.isEndEmpty(oneEnd) && this.isEndEmpty(otherEnd);
  }

  setOneEnd(jointEndLetter: WhichEnd, trackEnd: TrackEnd) {
    const track = trackEnd.endOf;
    this.ends[jointEndLetter].setEnd(track, trackEnd);
    if (this.ends[otherEnd(jointEndLetter)].isSet()) {
      this.ends.A.end.connect(this.ends.B.end, this);
    } else {
      this.ends[jointEndLetter].end.setJointTo(this);
    }
  }

  connect(other: TrackJoint) {
    const midpoint = this.computeMidpoint(other);

    // if there is no possible connection then return false
    if (midpoint === false) {
      return false;
    }

    // create coords for segment
    const coordinates = [this.position, midpoint, other.getPosition()];

    // determine which end is which
    const thisEndLetter = this.whichEnd(this, midpoint, other);
    const otherEndLetter = this.whichEnd(other, midpoint, this);
    const thisEnd = this.ends[thisEndLetter];
    const otherEnd = other.getEnds()[otherEndLetter];

    if (this.areBothEndsEmpty(thisEnd, otherEnd)) {
      const t = this.TrackFactory().init(coordinates);

      this.setOneEnd(thisEndLetter, t.getA());
      other.setOneEnd(otherEndLetter, t.getB());

      return { track: t };
    }

    if (this.isEndEmpty(thisEnd)) {
      const oldTrack: TrackBase = otherEnd.track;
      const oldCoordinates = oldTrack.getSegment().getCoordinates();

      const sw = this.TrackSwitchFactory().init(oldCoordinates, coordinates);

      const third = oldTrack.getA().getJointTo();

      oldTrack.getA().disconnect();
      oldTrack.getB().disconnect();
      oldTrack.remove();

      other.setOneEnd(otherEndLetter, sw.getA());
      this.setOneEnd(thisEndLetter, sw.getE());
      third.setOneEnd(thisEndLetter, sw.getF());

      return { track: sw, removed: oldTrack };
    }

    if (this.isEndEmpty(otherEnd)) {
      const oldTrack: TrackBase = thisEnd.track;
      const oldCoordinates = oldTrack.getSegment().getCoordinates();

      const sw = this.TrackSwitchFactory().init(oldCoordinates, coordinates);

      const third = oldTrack.getB().getJointTo();

      oldTrack.getA().disconnect();
      oldTrack.getB().disconnect();
      oldTrack.remove();

      this.setOneEnd(thisEndLetter, sw.getA());
      other.setOneEnd(otherEndLetter, sw.getE());
      third.setOneEnd(otherEndLetter, sw.getF());

      return { track: sw, removed: oldTrack };
    }

    return false;
  }

  getPosition() {
    return this.position;
  }

  getRotation() {
    return this.rotation;
  }

  getEnds() {
    return this.ends;
  }

  getId() {
    return this.id;
  }

  isRemoved(): boolean {
    return this.removed;
  }

  select(): void {
    this.selected = true;
    this.renderer.update();
  }

  deselect(): void {
    this.selected = false;
    this.renderer.update();
  }

  isSelected(): boolean {
    return this.selected;
  }
}

function almost(a, b) {
  return Math.abs(a - b) < 0.00001;
}
