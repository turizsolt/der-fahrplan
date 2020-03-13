import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { LineSegment } from '../../src/structs/Geometry/LineSegment';
chai.use(chaiAlmost(0.00001));

describe('Line segment and line segment intersection', () => {
  it('intersects', () => {
    const seg1 = LineSegment.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(0, 0, 20)
    );

    const seg2 = LineSegment.fromTwoPoints(
      new Coordinate(-10, 0, 10),
      new Coordinate(10, 0, 10)
    );

    const points: Coordinate[] = seg1.getIntersectionsWith(seg2);

    expect(points).deep.almost([new Coordinate(0, 0, 10)]);
  });

  it('intersects diagonally', () => {
    const seg1 = LineSegment.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(20, 0, 20)
    );

    const seg2 = LineSegment.fromTwoPoints(
      new Coordinate(20, 0, 0),
      new Coordinate(0, 0, 20)
    );

    const points: Coordinate[] = seg1.getIntersectionsWith(seg2);

    expect(points).deep.almost([new Coordinate(10, 0, 10)]);
  });

  it('not intersects', () => {
    const seg1 = LineSegment.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(20, 0, 20)
    );

    const seg2 = LineSegment.fromTwoPoints(
      new Coordinate(200, 0, 0),
      new Coordinate(0, 0, 220)
    );

    const points: Coordinate[] = seg1.getIntersectionsWith(seg2);

    expect(points).deep.almost([]);
  });

  it('paralel', () => {
    const seg1 = LineSegment.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(20, 0, 20)
    );

    const seg2 = LineSegment.fromTwoPoints(
      new Coordinate(0, 0, 10),
      new Coordinate(20, 0, 30)
    );

    const points: Coordinate[] = seg1.getIntersectionsWith(seg2);

    expect(points).deep.almost([]);
  });
});
