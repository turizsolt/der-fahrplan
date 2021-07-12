import { Coordinate } from './Coordinate';
import { almost, almostOrLess, almostDirection } from './Almost';
import { WhichEnd } from '../Interfaces/WhichEnd';
import { RayData } from './RayData';

const MINIMUM = (Math.sqrt(3) / 2) * 10;

export class Ray {
  constructor(public coord: Coordinate, public dirXZ: number) {
    this.onlyIfAwayEnough = this.onlyIfAwayEnough.bind(this);
  }

  static from(x: number, y: number, z: number, dirXZ: number): Ray {
    return new Ray(new Coordinate(x, y, z), dirXZ);
  }

  static fromData(ray: RayData): Ray {
    return new Ray(new Coordinate(ray.x, ray.y, ray.z), ray.dirXZ);
  }

  slope() {
    if (
      almost(this.dirXZ % Math.PI, Math.PI / 2) ||
      almost(this.dirXZ % Math.PI, -Math.PI / 2)
    ) {
      return Infinity;
    }
    return Math.tan(this.dirXZ);
  }

  equ() {
    return this.slope() !== Infinity
      ? {
          a: this.slope(),
          b: this.coord.x - this.slope() * this.coord.z
        }
      : {
          a: this.slope(),
          z: this.coord.z
        };
  }

  computeMidpoint(otherRay: Ray): undefined | false | Coordinate {
    return this.computeMidpointHelper(otherRay, this.id);
  }

  computeMidpointIfAwayEnough(otherRay: Ray): undefined | false | Coordinate {
    return this.computeMidpointHelper(otherRay, this.onlyIfAwayEnough);
  }

  private computeMidpointHelper(
    otherRay: Ray,
    fx: (c: Coordinate, r: Ray) => undefined | false | Coordinate
  ): undefined | false | Coordinate {
    const e1 = this.equ();
    const e2 = otherRay.equ();

    if (e1.a === Infinity && e2.a === Infinity)
      return almost(e1.z, e2.z) ? undefined : false;

    if (e1.a === Infinity) {
      const x = e2.a * e1.z + e2.b;
      const z = e1.z;

      return fx(new Coordinate(x, 0, z), otherRay);
    }

    if (e2.a === Infinity) {
      const x = e1.a * e2.z + e1.b;
      const z = e2.z;

      return fx(new Coordinate(x, 0, z), otherRay);
    }

    if (almost(e1.a, e2.a)) {
      return almost(e1.b, e2.b) ? undefined : false;
    }

    const z = (e2.b - e1.b) / (e1.a - e2.a);
    const x = e1.a * z + e1.b;

    return fx(new Coordinate(x, 0, z), otherRay);
  }

  private id(coord: Coordinate, ray: Ray): Coordinate {
    return coord;
  }

  private onlyIfAwayEnough(
    coord: Coordinate,
    otherRay: Ray
  ): Coordinate | false | undefined {
    const d1 = this.getPosition().distance2d(coord);
    const d2 = otherRay.getPosition().distance2d(coord);
    return almostOrLess(d1, MINIMUM) || almostOrLess(d2, MINIMUM)
      ? false
      : coord;
  }

  getPosition(): Coordinate {
    return this.coord;
  }

  getRotation(): number {
    return this.dirXZ;
  }

  fromHere(rad: number, dist: number): Ray {
    const shift = new Coordinate(
      Math.sin(this.dirXZ + rad) * dist,
      0,
      Math.cos(this.dirXZ + rad) * dist
    );

    return new Ray(this.coord.add(shift), this.dirXZ);
  }

  fromHereAbs(rad: number, dist: number): Ray {
    const shift = new Coordinate(Math.sin(rad) * dist, 0, Math.cos(rad) * dist);

    return new Ray(this.coord.add(shift), rad);
  }

  setY(y: number): Ray {
    return new Ray(new Coordinate(this.coord.x, y, this.coord.z), this.dirXZ);
  }

  getArr(): number[] {
    return [this.coord.x, this.coord.y, this.coord.z];
  }

  whichEnd(comparePosition: Coordinate): WhichEnd {
    const direction = Math.atan2(
      comparePosition.x - this.getPosition().x,
      comparePosition.z - this.getPosition().z
    );

    return almostDirection(direction, this.getRotation())
      ? WhichEnd.B
      : WhichEnd.A;
  }

  persist(): RayData {
    return {
      x: this.coord.x,
      y: this.coord.y,
      z: this.coord.z,
      dirXZ: this.dirXZ
    };
  }
}
