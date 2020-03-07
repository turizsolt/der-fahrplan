export class Coordinate {
  constructor(public x: number, public y: number, public z: number) {}

  add(v: Coordinate): Coordinate {
    return new Coordinate(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  scale(s: number): Coordinate {
    return new Coordinate(s * this.x, s * this.y, s * this.z);
  }

  clone(): Coordinate {
    return new Coordinate(this.x, this.y, this.z);
  }

  equalsTo(other: Coordinate): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  midpoint(other: Coordinate): Coordinate {
    return new Coordinate(
      (this.x + other.x) / 2,
      (this.y + other.y) / 2,
      (this.z + other.z) / 2
    );
  }

  distance2d(other: Coordinate): number {
    return Math.sqrt(
      Math.pow(this.x - other.x, 2) + Math.pow(this.z - other.z, 2)
    );
  }

  whichDir2d(other: Coordinate): number {
    return Math.atan2(other.x - this.x, other.z - this.z);
  }

  whichDir2db(other: Coordinate): number {
    return Math.atan2(other.z - this.z, other.x - this.x);
  }
}
