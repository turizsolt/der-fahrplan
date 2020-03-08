import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { LineSegment } from '../../src/structs/Geometry/LineSegment';
import { Ray } from '../../src/structs/Geometry/Ray';
import { Right } from '../../src/structs/Geometry/Directions';
chai.use(chaiAlmost(0.00001));

describe('Line segment projects point', () => {
  it('not on the line', () => {
    const seg = LineSegment.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(0, 0, 20)
    );

    const point = new Coordinate(10, 0, 10);
    const projected: Ray = seg.project(point);

    expect(projected).deep.equals(new Ray(new Coordinate(0, 0, 10), 0));
  });

  it('on the line', () => {
    const seg = LineSegment.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(0, 0, 20)
    );

    const point = new Coordinate(0, 0, 10);
    const projected: Ray = seg.project(point);

    expect(projected).deep.equals(new Ray(new Coordinate(0, 0, 10), 0));
  });

  it('diagonal line', () => {
    const seg = LineSegment.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(20, 0, 20)
    );

    const point = new Coordinate(20, 0, 0);
    const projected: Ray = seg.project(point);

    expect(projected).deep.almost(
      new Ray(new Coordinate(10, 0, 10), Right / 2)
    );
  });

  it('somewhere else', () => {
    const seg = LineSegment.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(0, 0, 20)
    );

    const point = new Coordinate(0, 0, 50);
    const projected: Ray = seg.project(point);

    expect(projected).deep.equals(null);
  });
});
