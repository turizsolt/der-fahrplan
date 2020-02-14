import { Coordinate } from './Coordinate';

// TODO subclasses for each degree
export class Bezier {
  private coordinates: Coordinate[];
  private degree: number;

  constructor(coordinates: Coordinate[]) {
    this.coordinates = coordinates.filter(x => x !== undefined);
    this.degree = this.coordinates.length - 1;

    if (this.degree < 1) throw new Error('Too few coordinates to Bezier');
    if (this.degree > 2) throw new Error('Too many coordinates to Bezier');
  }

  getCoordinates() {
    return this.coordinates;
  }

  getIntermediate() {
    if (this.degree !== 2) return undefined;
    else return this.coordinates[1];
  }

  getLinePoints(count: number, mustManyPoints: boolean = false): Coordinate[] {
    if (this.degree === 1 && !mustManyPoints) return this.coordinates;

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

  getPoint(percentage: number): Coordinate {
    switch (this.degree) {
      case 1:
        return this.getPointOnLinear(percentage);
      case 2:
        return this.getPointOnQuadratic(percentage);
    }
  }

  getDirection(percentage: number): number {
    switch (this.degree) {
      case 1:
        return this.getDirectionOnLinear(percentage);
      case 2:
        return this.getDirectionOnQuadratic(percentage);
    }
  }

  private getPointOnQuadratic(percentage: number): Coordinate {
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

  private getPointOnLinear(percentage: number): Coordinate {
    const [start, end] = this.coordinates;
    return new Coordinate(
      (1 - percentage) * start.x + percentage * end.x,
      0,
      (1 - percentage) * start.z + percentage * end.z
    );
  }

  private getDirectionOnQuadratic(percentage: number): number {
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

  private getDirectionOnLinear(percentage: number): number {
    const [start, end] = this.coordinates;
    const lineDerived = new Coordinate(end.x - start.x, 0, end.z - start.z);
    return Math.atan2(lineDerived.x, lineDerived.z);
  }
}
