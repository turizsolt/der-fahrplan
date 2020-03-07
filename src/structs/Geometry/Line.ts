import { Ray } from './Ray';
import { Coordinate } from './Coordinate';

export class Line {
  constructor(public a: Ray) {}

  getDir() {
    return this.a.dirXZ;
  }

  static fromTwoPoints(a: Coordinate, b: Coordinate) {
    return new Line(new Ray(a, a.whichDir2db(b)));
  }

  getEquation(): { a: number; b: number; m: number } {
    // z − b = m * (x − a)
    return {
      a: this.a.coord.x,
      b: this.a.coord.z,
      m: Math.tan(this.a.dirXZ)
    };
  }
}
