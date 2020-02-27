import { Coordinate } from '../Coordinate';
import { Bezier } from './Bezier';

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

  getDirection(percentage: number): number {
    const [start, end] = this.coordinates;
    const lineDerived = new Coordinate(end.x - start.x, 0, end.z - start.z);
    return Math.atan2(lineDerived.x, lineDerived.z);
  }
}
