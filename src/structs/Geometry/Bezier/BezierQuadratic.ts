import { Coordinate } from '../Coordinate';
import { Bezier, DEFAULT_PRECISION } from './Bezier';

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

  getLength(count: number = DEFAULT_PRECISION): number {
    if (count < 2) throw new Error('Too few count to get points');

    let length = 0;
    let prevPoint = this.getPoint(0);
    for (let i = 1; i < count; i++) {
      const thisPoint = this.getPoint(i / (count - 1));
      length += prevPoint.distance2d(thisPoint);
      prevPoint = thisPoint;
    }
    return length;
  }
}
