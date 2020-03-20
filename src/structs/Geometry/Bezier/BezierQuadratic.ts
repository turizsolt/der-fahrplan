import { Coordinate } from '../Coordinate';
import { Bezier, DEFAULT_PRECISION } from './Bezier';
import { Circle } from '../Circle';
import * as quartic from '@skymaker/quartic';

export class BezierQuadratic extends Bezier {
  constructor(coordinates: Coordinate[]) {
    super(coordinates);
    if (this.coordinates.length !== 3) {
      throw new Error('Not right number of coordinates to QuadraticBezier');
    }
  }

  getDegree(): number {
    return 2;
  }

  getIntermediate(): Coordinate {
    return this.coordinates[1];
  }

  getPoint(percentage: number): Coordinate {
    const [start, intermediate, end] = this.coordinates;
    return new Coordinate(
      (1 - percentage) * (1 - percentage) * start.x +
        2 * (1 - percentage) * percentage * intermediate.x +
        percentage * percentage * end.x,
      0,
      (1 - percentage) * (1 - percentage) * start.z +
        2 * (1 - percentage) * percentage * intermediate.z +
        percentage * percentage * end.z
    );
  }

  getDirection(percentage: number): number {
    const [start, intermediate, end] = this.coordinates;
    const curveDerived = new Coordinate(
      2 * (1 - percentage) * (intermediate.x - start.x) +
        2 * percentage * (end.x - intermediate.x),
      0,
      2 * (1 - percentage) * (intermediate.z - start.z) +
        2 * percentage * (end.z - intermediate.z)
    );

    return Math.atan2(curveDerived.x, curveDerived.z);
  }

  intersectWithCircle(circle: Circle) {
    const [p0, p1, p2] = this.coordinates;
    const ce = circle.getEquation();

    const dx = p0.x - 2 * p1.x + p2.x;
    const ex = 2 * p1.x - 2 * p0.x;
    const fx = p0.x - ce.a;

    const dz = p0.z - 2 * p1.z + p2.z;
    const ez = 2 * p1.z - 2 * p0.z;
    const fz = p0.z - ce.b;

    const a = dx * dx + dz * dz;
    const b = 2 * dx * ex + 2 * dz * ez;
    const c = ex * ex + 2 * dx * fx + ez * ez + 2 * dz * fz;
    const d = 2 * ex * fx + 2 * ez * fz;
    const e = fx * fx + fz * fz - ce.r * ce.r;

    return quartic
      .solve(a, b, c, d, e)
      .filter(t => t.im == 0 && 0 <= t.re && t.re <= 1)
      .map(t => t.re);
  }
}
