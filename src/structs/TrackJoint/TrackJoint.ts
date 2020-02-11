import { TrackJointRenderer } from './TrackJointRenderer';
import { Coordinate } from '../Coordinate';
import { TYPES } from '../TYPES';
import { babylonContainer } from '../inversify.config';
import { Track } from '../Track';
import { TrackBase } from '../TrackBase';
import { Switch } from '../Switch';

export class TrackJoint {
  readonly id: number;
  public position: Coordinate;
  public rotation: number;
  public removed: boolean = false;
  public tracks: { A: TrackBase | null; B: TrackBase | null } = {
    A: null,
    B: null
  };

  private renderer: TrackJointRenderer;

  constructor(x: number, z: number, rot: number) {
    // console.log(`(${x}, ${z}) R${Math.round((rot * 180) / Math.PI)}`);
    this.id = (Math.random() * 1000000) | 0;

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

  connect(joint: TrackJoint) {
    const w: any = this.ww(joint);
    if (w) {
      // true lesz a B oldal
      const side = (b: boolean) => (b ? 'B' : 'A');

      const p1 = w === true ? joint.position : w;
      const dir1 = Math.atan2(p1.x - this.position.x, p1.z - this.position.z);
      const s1 = side(almost(dir1, this.rotation));

      const p2 = w === true ? this.position : w;
      const dir2 = Math.atan2(p2.x - joint.position.x, p2.z - joint.position.z);
      const s2 = side(almost(dir2, joint.rotation));

      if (this.tracks[s1] && this.tracks[s1].constructor.name === Switch.name)
        return false;
      if (joint.tracks[s2] && joint.tracks[s2].constructor.name === Switch.name)
        return false;
      if (
        this.tracks[s1] &&
        this.tracks[s1].constructor.name === Track.name &&
        joint.tracks[s2] &&
        joint.tracks[s2].constructor.name === Track.name
      )
        return false;

      // TODO
      console.log('s1s2', this.tracks[s1], joint.tracks[s2]);

      let t: Track;
      const jp = { x: joint.position.x, z: joint.position.z };
      const tp = { x: this.position.x, z: this.position.z };
      const wp = { x: w.x, z: w.z };

      if (w && w.z !== undefined) {
        t = new Track(jp, tp, wp);
        t.render(null);
      } else if (w) {
        t = new Track(jp, tp);
        t.render(null);
      }

      if (t) {
        this.tracks[s1] = t;
        joint.tracks[s2] = t;

        //console.log('typeof', t.constructor.name, Track.name);
      }
    } else {
      // not able to draw the track
    }
  }
}

function almost(a, b) {
  return Math.abs(a - b) < 0.00001;
}
