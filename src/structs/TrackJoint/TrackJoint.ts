import { TrackJointRenderer } from './TrackJointRenderer';
import { Coordinate } from '../Coordinate';
import { TYPES } from '../TYPES';
import { babylonContainer } from '../inversify.config';

export class TrackJoint {
  readonly id: number;
  public position: Coordinate;
  public rotation: number;
  public removed: boolean = false;

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

  connect(joint: TrackJoint) {
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
}

function almost(a, b) {
  return Math.abs(a - b) < 0.00001;
}
