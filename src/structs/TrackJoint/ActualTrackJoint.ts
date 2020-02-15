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
import { ActualTrackSwitch } from '../TrackSwitch/ActualTrackSwitch';

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

  remove() {
    // console.log(
    //   'r TJ',
    //   this.getId(),
    //   this.isRemovable(),
    //   this.ends.A.end && this.ends.A.end.getHash(),
    //   this.ends.B.end && this.ends.B.end.getHash()
    // );
    if (this.isRemovable()) {
      //   console.log('isset', this.ends.A.isSet(), this.ends.B.isSet());
      if (this.ends.A.isSet()) {
        // console.log('A');
        this.ends.A.track.remove();
        this.ends.A.unsetEnd();
      }
      //   console.log('isset2', this.ends.A.isSet(), this.ends.B.isSet());
      if (this.ends.B.isSet()) {
        // console.log('B');
        this.ends.B.track.remove();
        this.ends.B.unsetEnd();
      }
      //   console.log('isset3', this.ends.A.isSet(), this.ends.B.isSet());
      this.removed = true;
      this.renderer.update();
      return true;
    }
    return false;
  }

  removeEnd(end: TrackEnd) {
    // console.log(
    //   'remEnd',
    //   this.id,
    //   end.getHash(),
    //   this.ends.A.end && this.ends.A.end.getHash(),
    //   this.ends.B.end && this.ends.B.end.getHash()
    // );
    if (this.ends.A.end === end) {
      this.ends.A.unsetEnd();
    }
    if (this.ends.B.end === end) {
      this.ends.B.unsetEnd();
    }
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
    console.log(
      'whichend',
      almostDirection(direction, one.getRotation()),
      direction,
      one.getRotation()
    );
    return almostDirection(direction, one.getRotation())
      ? WhichEnd.B
      : WhichEnd.A;
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
    console.log('====CONNECT====');
    const midpoint = this.computeMidpoint(other);

    console.log('midpoint', midpoint);

    // if there is no possible connection then return false
    if (midpoint === false) {
      return false;
    }

    // create coords for segment
    const coordinates = [this.position, midpoint, other.getPosition()];
    console.log('coordinates', coordinates);

    // determine which end is which
    const thisEndLetter = this.whichEnd(this, midpoint, other);
    const thisEnd = this.ends[thisEndLetter];
    console.log(
      'this end',
      thisEndLetter,
      thisEnd.track && thisEnd.track.getId()
    );

    const otherEndLetter = this.whichEnd(other, midpoint, this);
    const otherEnd = other.getEnds()[otherEndLetter];
    console.log(
      'other end',
      otherEndLetter,
      otherEnd.track && otherEnd.track.getId()
    );

    if (this.areBothEndsEmpty(thisEnd, otherEnd)) {
      const t = this.TrackFactory().init(coordinates);

      this.setOneEnd(thisEndLetter, t.getA());
      other.setOneEnd(otherEndLetter, t.getB());

      return { track: t };
    }

    if (this.isEndEmpty(thisEnd) || this.isEndEmpty(otherEnd)) {
      const oldTrack: TrackBase = thisEnd.track || otherEnd.track;
      if (oldTrack.constructor.name === ActualTrackSwitch.name) return false;

      const oldCoordinates = oldTrack.getSegment().getCoordinates();

      const sw = this.TrackSwitchFactory().init(oldCoordinates, coordinates);

      const thirdA = oldTrack.getA().getJointTo();
      const thirdB = oldTrack.getB().getJointTo();
      console.log(
        'third wheel',
        this.getId(),
        other.getId(),
        thirdA.getId(),
        thirdB.getId()
      );

      //const third = thirdA === this || thirdA === other ? thirdB : thirdA;
      let third, second, peak, peakLetter, secondLetter;
      if (thirdA === this) {
        third = thirdB;
        peak = this;
        peakLetter = thisEndLetter;
        second = other;
        secondLetter = otherEndLetter;
      } else if (thirdB === this) {
        third = thirdA;
        peak = this;
        peakLetter = thisEndLetter;
        second = other;
        secondLetter = otherEndLetter;
      } else if (thirdA === other) {
        third = thirdB;
        peak = other;
        peakLetter = otherEndLetter;
        second = this;
        secondLetter = thisEndLetter;
      } else if (thirdB === other) {
        third = thirdA;
        peak = other;
        peakLetter = otherEndLetter;
        second = this;
        secondLetter = thisEndLetter;
      }

      let thirdLetter;
      if (oldTrack.getA().getJointTo() === peak) {
        thirdLetter = oldTrack
          .getB()
          .getJointTo()
          .getTracksEnd(oldTrack);
      }
      if (oldTrack.getB().getJointTo() === peak) {
        thirdLetter = oldTrack
          .getA()
          .getJointTo()
          .getTracksEnd(oldTrack);
      }

      oldTrack.getA().disconnect();
      oldTrack.getB().disconnect();
      oldTrack.remove();

      ///////////////const thirdLetter = this.whichEnd(third, midpoint, other);

      peak.setOneEnd(peakLetter, sw.getA());
      second.setOneEnd(secondLetter, sw.getE());
      third.setOneEnd(thirdLetter, sw.getF());
      //this.setOneEnd(thisEndLetter, sw.getA());
      //other.setOneEnd(otherEndLetter, sw.getE());
      //third.setOneEnd(otherEndLetter, sw.getF());

      console.log('first || second branch');
      this.verbose();

      return { track: sw, removed: oldTrack };
    }

    return false;
  }

  getTracksEnd(track: TrackBase): WhichEnd | undefined {
    if (this.ends.A.track === track) return WhichEnd.A;
    if (this.ends.B.track === track) return WhichEnd.B;
    return undefined;
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

  verbose(): void {
    console.log('joint ', this.id);
    console.log('A ', this.ends.A.end && this.ends.A.end.getHash());
    console.log('B ', this.ends.B.end && this.ends.B.end.getHash());
    console.log('/joint');
  }
}

function almost(a, b) {
  return Math.abs(a - b) < 0.00001;
}

function almostDirection(a, b) {
  const diff = Math.abs(a - b);
  const small = 0.00001;
  return (
    diff < small || (2 * Math.PI - small < diff && diff < 2 * Math.PI + small)
  );
}
