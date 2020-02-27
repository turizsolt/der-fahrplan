import { Coordinate } from '../Coordinate';
import { Ray } from '../Ray';

export abstract class Bezier {
  protected coordinates: Coordinate[];

  constructor(coordinates: Coordinate[]) {
    this.coordinates = coordinates.filter(x => x !== undefined);
  }

  abstract getIntermediate(): Coordinate;
  abstract getDegree(): number;
  abstract getPoint(percentage: number): Coordinate;
  abstract getDirection(percentage: number): number;

  getCoordinates() {
    return this.coordinates;
  }

  getRay(percentage: number): Ray {
    return new Ray(this.getPoint(percentage), this.getDirection(percentage));
  }

  getLinePoints(count: number, mustManyPoints: boolean = false): Coordinate[] {
    if (this.getDegree() === 1 && !mustManyPoints) return this.coordinates;

    if (count < 2) throw new Error('Too few count to get points');

    const points = [];
    for (let i = 0; i < count; i++) {
      points.push(this.getPoint(i / (count - 1)));
    }
    return points;
  }

  static getSectionLength(a, b: Coordinate): number {
    return Math.sqrt(
      Math.pow(Math.abs(a.x - b.x), 2) + Math.pow(Math.abs(a.z - b.z), 2)
    );
  }

  static getLength(coordinate: Coordinate[]): number {
    let length = 0;
    const last = coordinate.length - 1;
    for (let i = 0; i < last; i++) {
      length += Bezier.getSectionLength(coordinate[i], coordinate[i + 1]);
    }
    return length;
  }
}
