import { Ray } from './Ray';

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
}
