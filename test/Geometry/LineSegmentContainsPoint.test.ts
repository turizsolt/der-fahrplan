import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { LineSegment } from '../../src/structs/Geometry/LineSegment';
chai.use(chaiAlmost(0.00001));

describe('Line segment contains point', () => {
  it('not on the line', () => {
    const seg = LineSegment.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(0, 0, 20)
    );

    const point = new Coordinate(-10, 0, 10);
    const contains: boolean = seg.contains(point);

    expect(contains).equals(false);
  });

  it('on the line, and the segment', () => {
    const seg = LineSegment.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(0, 0, 20)
    );

    const point = new Coordinate(0, 0, 10);
    const contains: boolean = seg.contains(point);

    expect(contains).equals(true);
  });

  it('on the line, but not the segment, above', () => {
    const seg = LineSegment.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(0, 0, 20)
    );

    const point = new Coordinate(0, 0, 30);
    const contains: boolean = seg.contains(point);

    expect(contains).equals(false);
  });

  it('on the line, but not the segment, below', () => {
    const seg = LineSegment.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(0, 0, 20)
    );

    const point = new Coordinate(0, 0, -10);
    const contains: boolean = seg.contains(point);

    expect(contains).equals(false);
  });
});
