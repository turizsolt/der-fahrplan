import { Ray } from './Ray';
import { Line } from './Line';
import { Coordinate } from './Coordinate';
import { QuadraticEquation } from './QuadraticEquation';
import { almost } from './Almost';

export class Circle {
  constructor(public a: Coordinate, public r: number) {}

  getEquation(): { r: number; a: number; b: number } {
    // (x-a)^2 + (z-b)^2 = r^2
    return {
      r: this.r,
      a: this.a.x,
      b: this.a.z
    };
  }

  getIntersectionsWithLine(line: Line): Coordinate[] {
    const le = line.getEquation();
    const ce = this.getEquation();

    if (almost(le.rad % Math.PI, 0) || almost(le.rad % Math.PI, Math.PI)) {
      const sols = QuadraticEquation.solve(
        1,
        -2 * ce.b,
        ce.b * ce.b + (le.a - ce.a) * (le.a - ce.a) - ce.r * ce.r
      );
      return sols.map(z => new Coordinate(le.a, 0, z));
    } else {
      const c = -le.m * le.a + le.b - ce.b;
      const sols = QuadraticEquation.solve(
        1 + le.m * le.m,
        -2 * ce.a + 2 * c * le.m,
        c * c - ce.r * ce.r + ce.a * ce.a
      );
      return sols.map(x => new Coordinate(x, 0, le.m * (x - le.a) + le.b));
    }
  }
}
