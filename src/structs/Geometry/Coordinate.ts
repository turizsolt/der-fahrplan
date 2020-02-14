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
}
