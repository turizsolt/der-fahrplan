import { TrackJointRenderer } from './TrackJointRenderer';
import { Coordinate } from '../Geometry/Coordinate';
import { TYPES } from '../TYPES';
import { babylonContainer } from '../inversify.config';
import { Track } from '../Track/Track';
import { TrackJointEnd } from './TrackJointEnd';
import { TrackSwitch } from '../TrackSwitch/TrackSwitch';

// true lesz a B oldal
const side = (b: boolean) => (b ? 'B' : 'A');
const otherSide = (ch: 'A' | 'B'): 'A' | 'B' => (ch === 'A' ? 'B' : 'A');

export class TrackJoint {
  readonly id: number;
  public position: Coordinate;
  public rotation: number;
  public removed: boolean = false;
  public ends: { A: TrackJointEnd; B: TrackJointEnd };

  private renderer: TrackJointRenderer;

  constructor(x: number, z: number, rot: number) {
    // console.log(`(${x}, ${z}) R${Math.round((rot * 180) / Math.PI)}`);
    this.id = (Math.random() * 1000000) | 0;

    this.ends = {
      A: new TrackJointEnd(),
      B: new TrackJointEnd()
    };

    this.position = new Coordinate(x, 0, z);
    this.rotation = rot;

    this.renderer = babylonContainer.get<TrackJointRenderer>(
      TYPES.TrackJointRenderer
    );
    this.renderer.init(this);
  }

  rotate(rot: number) {
    this.rotation = rot;
    this.renderer.update();
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

  ww(joint: TrackJoint) {
    const e1 = this.equ();
    const e2 = joint.equ();

    if (e1.a === Infinity && e2.a === Infinity) return almost(e1.z, e2.z);

    if (e1.a === Infinity) {
      const x = e2.a * e1.z + e2.b;
      const z = e1.z;
      return { x, z };
    }

    if (e2.a === Infinity) {
      const x = e1.a * e2.z + e1.b;
      const z = e2.z;
      return { x, z };
    }

    if (almost(e1.a, e2.a)) {
      return almost(e1.b, e2.b);
    }

    const z = (e2.b - e1.b) / (e1.a - e2.a);
    const x = e1.a * z + e1.b;
    return { x, z };
  }

  whichEnd(w: any, one: TrackJoint, other: TrackJoint) {
    const comparePosition = w === true ? other.position : w;
    const direction = Math.atan2(
      comparePosition.x - one.position.x,
      comparePosition.z - one.position.z
    );
    return side(almost(direction, one.rotation));
  }

  connect(joint: TrackJoint) {
    const w: any = this.ww(joint);
    if (!w) return { track: null };

    const jp = new Coordinate(joint.position.x, 0, joint.position.z);
    const tp = new Coordinate(this.position.x, 0, this.position.z);
    const wp = new Coordinate(w.x, 0, w.z);

    if (
      !this.ends[this.whichEnd(w, this, joint)].isSet() &&
      !joint.ends[this.whichEnd(w, joint, this)].isSet()
    ) {
      let t: Track;
      if (w && w.z !== undefined) {
        t = new Track(jp, tp, wp);
      } else if (w) {
        t = new Track(jp, tp);
      }

      this.setOneEnd(this.whichEnd(w, this, joint), t, t.B, 'B');
      joint.setOneEnd(this.whichEnd(w, joint, this), t, t.A, 'A');

      return { track: t };
    }

    if (!this.ends[this.whichEnd(w, this, joint)].isSet()) {
      const oldTrack = joint.ends[this.whichEnd(w, joint, this)].track;

      const sw = new TrackSwitch(
        oldTrack.A.point,
        oldTrack.B.point,
        tp,
        oldTrack.I,
        wp
      );

      oldTrack.A.disconnect();
      oldTrack.B.disconnect();
      // TODO (oldTrack as Track).mesh.setEnabled(false);

      this.setOneEnd(this.whichEnd(w, this, joint), sw, sw.B, 'B');
      joint.setOneEnd(this.whichEnd(w, joint, this), sw, sw.A, 'A');

      return {};
    }
  }

  setOneEnd(jointEnd, track, trackEnd, trackEndName) {
    console.log(jointEnd, trackEndName);
    this.ends[jointEnd].setEnd(track, trackEnd);
    if (this.ends[otherSide(jointEnd)].isSet()) {
      this.ends.A.end.connect(this.ends.B.end);
    }
  }
}

function almost(a, b) {
  return Math.abs(a - b) < 0.00001;
}
