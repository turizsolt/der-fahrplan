import { Ray } from './Ray';
import { Line } from './Line';
import { Coordinate } from './Coordinate';
import { almost } from './Almost';

export class RayPair {
  constructor(public a: Ray, public b: Ray) {}

  getLength() {
    return this.a.coord.distance2d(this.b.coord);
  }

  getDir() {
    return this.a.coord.whichDir2d(this.b.coord);
  }

  getPointAtDistance(dist: number) {
    return this.a.fromHereAbs(this.getDir(), dist);
  }

  toLine(): Line {
    return Line.fromTwoPoints(this.a.coord, this.b.coord);
  }

  contains(p: Coordinate): boolean {
    return almost(
      this.a.coord.distance2d(p) + this.b.coord.distance2d(p),
      this.getLength()
    );
  }
}
