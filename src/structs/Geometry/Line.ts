import { Ray } from './Ray';
import { Coordinate } from './Coordinate';

export class Line {
  constructor(public a: Ray) {}

  getDir() {
    return this.a.dirXZ;
  }

  static fromTwoPoints(a: Coordinate, b: Coordinate) {
    return new Line(new Ray(a, a.whichDir2d(b)));
  }

  static fromPointAndDir(p: Coordinate, dir: number) {
    return new Line(new Ray(p, dir));
  }

  getEquation(): { a: number; b: number; m: number; rad: number } {
    // z − b = m * (x − a)
    return {
      a: this.a.coord.x,
      b: this.a.coord.z,
      m: Math.tan(Math.PI / 2 - this.a.dirXZ), // need to mirror the value to 45 degrees
      rad: this.a.dirXZ
    };
  }

  getIntersectionsWith(other: Line) {
    const p = other.a.computeMidpoint(this.a);
    if (p) return [p];
    return [];
  }
}
