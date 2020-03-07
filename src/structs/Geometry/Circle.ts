import { Ray } from './Ray';
import { Line } from './Line';
import { Coordinate } from './Coordinate';
import { QuadraticEquation } from './QuadraticEquation';

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
    const c = -le.m * le.a + le.b - ce.b;
    const sols = QuadraticEquation.solve(
      1 + le.m * le.m,
      -2 * ce.a + 2 * c * le.m,
      c * c - ce.r * ce.r + ce.a * ce.a
    );

    return sols.map(x => new Coordinate(x, 0, le.m * (x - le.a) + le.b));
  }
}
