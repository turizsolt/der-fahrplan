import { Coordinate } from '../Coordinate';
import { Bezier } from './Bezier';
import { Circle } from '../Circle';
import { QuadraticEquation } from '../QuadraticEquation';

export class BezierLinear extends Bezier {
  constructor(coordinates: Coordinate[]) {
    super(coordinates);
    if (this.coordinates.length !== 2) {
      throw new Error('Not right number of coordinates to LinearBezier');
    }
  }

  getDegree(): number {
    return 1;
  }

  getIntermediate(): Coordinate {
    return undefined;
  }

  getPoint(percentage: number): Coordinate {
    const [start, end] = this.coordinates;
    return new Coordinate(
      (1 - percentage) * start.x + percentage * end.x,
      0,
      (1 - percentage) * start.z + percentage * end.z
    );
  }

  getDirection(_: number): number {
    const [start, end] = this.coordinates;
    const lineDerived = new Coordinate(end.x - start.x, 0, end.z - start.z);
    return Math.atan2(lineDerived.x, lineDerived.z);
  }

  intersectWithCircle(circle: Circle) {
    const [p0, p1] = this.coordinates;
    const ce = circle.getEquation();

    const dx = p1.x - p0.x;
    const ex = p0.x - ce.a;

    const dz = p1.z - p0.z;
    const ez = p0.z - ce.b;

    //console.log(dx, ex, dz, ez);
    return QuadraticEquation.solve(
      dx * dx + dz * dz,
      2 * dx * ex + 2 * dz * ez,
      ex * ex + ez * ez - ce.r * ce.r
    ).filter(t => 0 <= t && t <= 1);
  }
}
