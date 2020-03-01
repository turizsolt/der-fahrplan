import { Coordinate } from '../Coordinate';
import { Ray } from '../Ray';

export const DEFAULT_PRECISION: number = 20;

export abstract class Bezier {
  protected coordinates: Coordinate[];

  constructor(coordinates: Coordinate[]) {
    this.coordinates = coordinates.filter(x => x !== undefined);
  }

  abstract getIntermediate(): Coordinate;
  abstract getDegree(): number;
  abstract getPoint(percentage: number): Coordinate;
  abstract getDirection(percentage: number): number;
  abstract getLength(count?: number): number;

  getCoordinates() {
    return this.coordinates;
  }

  getRay(percentage: number): Ray {
    return new Ray(this.getPoint(percentage), this.getDirection(percentage));
  }

  getLinePoints(count: number = DEFAULT_PRECISION): Coordinate[] {
    if (count < 2) throw new Error('Too few count to get points');

    const points = [];
    for (let i = 0; i < count; i++) {
      points.push(this.getPoint(i / (count - 1)));
    }
    return points;
  }
}
