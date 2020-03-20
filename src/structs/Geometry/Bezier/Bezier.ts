import { Coordinate } from '../Coordinate';
import { Ray } from '../Ray';
import { LineSegmentChain } from '../LineSegmentChain';
import { Circle } from '../Circle';

export const DEFAULT_PRECISION: number = 9;
export const DEFAULT_DISTANCE: number = 2;

export abstract class Bezier {
  protected coordinates: Coordinate[];

  constructor(coordinates: Coordinate[]) {
    this.coordinates = coordinates.filter(x => x !== undefined);
  }

  abstract getIntermediate(): Coordinate;
  abstract getDegree(): number;
  abstract getPoint(percentage: number): Coordinate;
  abstract getDirection(percentage: number): number;
  abstract intersectWithCircle(circle: Circle);

  getCoordinates() {
    return this.coordinates;
  }

  getRay(percentage: number): Ray {
    return new Ray(this.getPoint(percentage), this.getDirection(percentage));
  }

  getLineSegmentChain(precision: number = DEFAULT_PRECISION): LineSegmentChain {
    if (precision < 2) {
      precision = 2;
    }

    const rays = [];
    for (let i = 0; i < precision; i++) {
      rays.push(this.getRay(i / (precision - 1)));
    }
    return LineSegmentChain.fromRays(rays);
  }
}
