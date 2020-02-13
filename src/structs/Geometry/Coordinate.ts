export class Coordinate {
  constructor(public x: number, public y: number, public z: number) {}

  add(v: Coordinate): Coordinate {
    return new Coordinate(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  clone(): Coordinate {
    return new Coordinate(this.x, this.y, this.z);
  }
}
