import { Coordinate } from '../Coordinate';
import { Ray } from '../Ray';
import { RayPair } from '../RayPair';

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
  abstract getLength(count?: number): number;

  getCoordinates() {
    return this.coordinates;
  }

  getRay(percentage: number): Ray {
    return new Ray(this.getPoint(percentage), this.getDirection(percentage));
  }

  getRayByDistance(distance: number): Ray {
    const segments = this.getLinePairRays();
    let segment = 0;

    let sdist = segments[segment].getLength();
    let pos = distance;

    while (pos > sdist && segment < segments.length - 1) {
      pos -= sdist;
      segment++;
      sdist = segments[segment].getLength();
    }

    if (segment < segments.length)
      return segments[segment].getPointAtDistance(pos);
    return null;
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

  getLineOffRays(
    step: number = DEFAULT_DISTANCE,
    count: number = DEFAULT_PRECISION
  ): Ray[] {
    const points = [];
    const segments = this.getLinePairRays(count);
    const length = this.getLength();
    let segment = 0;
    let gone = 0;
    let pos = 0;

    const put = () => {
      points.push(segments[segment].getPointAtDistance(pos));
    };

    put();
    let sdist;
    while (gone < length) {
      sdist = segments[segment].getLength();
      pos = pos + step;
      gone = gone + step;

      while (pos > sdist && segment < segments.length - 1) {
        pos -= sdist;
        segment++;
        sdist = segments[segment].getLength();
      }

      if (gone < length) put();
    }

    return points.filter((v, i) => i % 2 === 1);
  }

  getLinePairRays(count: number = DEFAULT_PRECISION): RayPair[] {
    if (count < 2) throw new Error('Too few count to get points');

    const pointPairs = [];
    let last = this.getRay(0);
    for (let i = 1; i < count; i++) {
      const now = this.getRay(i / (count - 1));
      pointPairs.push(new RayPair(last, now));
      last = now;
    }
    return pointPairs;
  }
}
