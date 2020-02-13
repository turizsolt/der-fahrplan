import { Coordinate } from './Coordinate';

export class Bezier {
  static pointOnCurve(
    percentage: number,
    start: Coordinate,
    intermediate: Coordinate,
    end: Coordinate
  ): Coordinate {
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

  static directionOnCurve(
    percentage: number,
    start: Coordinate,
    intermediate: Coordinate,
    end: Coordinate
  ): number {
    const curveDerived = new Coordinate(
      2 * (1 - percentage) * (intermediate.x - start.x) +
        2 * percentage * (end.x - intermediate.x),
      0,
      2 * (1 - percentage) * (intermediate.z - start.z) +
        2 * percentage * (end.z - intermediate.z)
    );

    return Math.atan2(curveDerived.x, curveDerived.z);
  }

  static pointOnLine(
    percentage: number,
    start: Coordinate,
    end: Coordinate
  ): Coordinate {
    return new Coordinate(
      (1 - percentage) * start.x + percentage * end.x,
      0,
      (1 - percentage) * start.z + percentage * end.z
    );
  }

  static directionOnLine(start: Coordinate, end: Coordinate): number {
    const lineDerived = new Coordinate(end.x - start.x, 0, end.z - start.z);
    return Math.atan2(lineDerived.x, lineDerived.z);
  }
}
