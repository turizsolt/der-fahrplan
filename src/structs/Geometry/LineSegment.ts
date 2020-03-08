import { Ray } from './Ray';
import { Coordinate } from './Coordinate';
import { Line } from './Line';
import { almost } from './Almost';
import { Left } from './Directions';

export class LineSegment {
  private constructor(public a: Coordinate, public b: Coordinate) {}

  static fromTwoPoints(a: Coordinate, b: Coordinate) {
    return new LineSegment(a, b);
  }

  getLength() {
    return this.a.distance2d(this.b);
  }

  getDir() {
    return this.a.whichDir2d(this.b);
  }

  getPointAtDistance(dist: number) {
    return new Ray(
      this.a,
      Math.atan2(this.b.x - this.a.x, this.b.z - this.a.z)
    ).fromHere(0, dist);
  }

  isIntersectsWith(other: LineSegment) {
    const c1 = this.crossProduct(other.a);
    const c2 = this.crossProduct(other.b);
    const c3 = other.crossProduct(this.a);
    const c4 = other.crossProduct(this.b);

    if (c1 * c2 === -1 && c3 * c4 === -1) return true;
    if (c1 * c2 === 0 && c3 * c4 === -1) return true;
    if (c1 * c2 === -1 && c3 * c4 === 0) return true;
    return false;
  }

  getIntersectionsWith(other: LineSegment) {
    if (!this.isIntersectsWith(other)) return [];

    const r1 = new Ray(
      this.a,
      Math.atan2(this.b.x - this.a.x, this.b.z - this.a.z)
    );
    const r2 = new Ray(
      other.a,
      Math.atan2(other.b.x - other.a.x, other.b.z - other.a.z)
    );

    const p = r2.computeMidpoint(r1);
    if (p) return [p];
    return [];
  }

  // returns 1 if point is on the left, -1 if on the right, 0 if on the line (not the segment)
  crossProduct(p: Coordinate) {
    return Math.sign(
      (this.b.x - this.a.x) * (p.z - this.a.z) -
        (this.b.z - this.a.z) * (p.x - this.a.x)
    );
  }

  toLine(): Line {
    return Line.fromTwoPoints(this.a, this.b);
  }

  contains(p: Coordinate): boolean {
    return almost(
      this.a.distance2d(p) + this.b.distance2d(p),
      this.getLength()
    );
  }

  project(p: Coordinate): Ray {
    const dir = this.getDir() + Left;
    const line = Line.fromPointAndDir(p, dir);
    const meAsLine = this.toLine();
    const intersections = meAsLine.getIntersectionsWith(line);
    if (intersections.length === 1 && this.contains(intersections[0])) {
      return new Ray(intersections[0], this.getDir());
    } else {
      return null;
    }
  }
}
