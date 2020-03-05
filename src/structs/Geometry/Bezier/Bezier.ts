import { Coordinate } from '../Coordinate';
import { Ray } from '../Ray';

export const DEFAULT_PRECISION: number = 25;

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

  getLineRays(count: number = DEFAULT_PRECISION): Ray[] {
    if (count < 2) throw new Error('Too few count to get points');

    const points = [];
    for (let i = 0; i < count; i++) {
      points.push(this.getRay(i / (count - 1)));
    }
    return points;
  }

  getLineOffRays(count: number = DEFAULT_PRECISION): Ray[] {
    if (count < 2) throw new Error('Too few count to get points');

    const points = [];
    count = count * 2 - 1;
    for (let i = 1; i < count; i += 2) {
      points.push(this.getRay(i / (count - 1)));
    }
    return points;
  }

  getLinePairRays(count: number = DEFAULT_PRECISION): Ray[][] {
    if (count < 2) throw new Error('Too few count to get points');

    const pointPairs = [];
    let last = this.getRay(0);
    for (let i = 1; i < count; i++) {
      const now = this.getRay(i / (count - 1));
      pointPairs.push([last, now]);
      last = now;
    }
    return pointPairs;
  }
}
