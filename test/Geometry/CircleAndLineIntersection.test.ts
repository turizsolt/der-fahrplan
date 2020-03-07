import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { Line } from '../../src/structs/Geometry/Line';
import { Circle } from '../../src/structs/Geometry/Circle';
chai.use(chaiAlmost(0.00001));

describe('Line and circle intersection', () => {
  it('through on the middle', () => {
    const line = Line.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(10, 0, 0)
    );
    const circle = new Circle(new Coordinate(0, 0, 0), 10);

    const points: Coordinate[] = circle.getIntersectionsWithLine(line);

    expect(points).deep.equals([
      new Coordinate(10, 0, 0),
      new Coordinate(-10, 0, 0)
    ]);
  });

  it('through on the middle vertically', () => {
    const line = Line.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(0, 0, 10)
    );
    const circle = new Circle(new Coordinate(0, 0, 0), 10);

    const points: Coordinate[] = circle.getIntersectionsWithLine(line);

    expect(points).deep.almost([
      new Coordinate(0, 0, 10),
      new Coordinate(0, 0, -10)
    ]);
  });

  it('through on the middle diagonally', () => {
    const line = Line.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(10, 0, 10)
    );
    const circle = new Circle(new Coordinate(0, 0, 0), 10);

    const points: Coordinate[] = circle.getIntersectionsWithLine(line);

    expect(points).deep.almost([
      new Coordinate(Math.sqrt(50), 0, Math.sqrt(50)),
      new Coordinate(-Math.sqrt(50), 0, -Math.sqrt(50))
    ]);
  });

  it('meeting the edge', () => {
    const line = Line.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(10, 0, 0)
    );
    const circle = new Circle(new Coordinate(0, 0, 10), 10);

    const points: Coordinate[] = circle.getIntersectionsWithLine(line);

    expect(points).deep.equals([new Coordinate(0, 0, 0)]);
  });

  it('not intersecting', () => {
    const line = Line.fromTwoPoints(
      new Coordinate(0, 0, 0),
      new Coordinate(10, 0, 0)
    );
    const circle = new Circle(new Coordinate(0, 0, 20), 10);

    const points: Coordinate[] = circle.getIntersectionsWithLine(line);

    expect(points).deep.equals([]);
  });

  it('general case', () => {
    const line = Line.fromTwoPoints(
      new Coordinate(14, 0, 19),
      new Coordinate(13, 0, 22)
    );
    const circle = new Circle(new Coordinate(15, 0, 20), 9);

    const points: Coordinate[] = circle.getIntersectionsWithLine(line);

    expect(points).deep.almost([
      new Coordinate(
        (69 + Math.sqrt(397 / 2)) / 5,
        0,
        (98 - 3 * Math.sqrt(397 / 2)) / 5
      ),
      new Coordinate(
        (69 - Math.sqrt(397 / 2)) / 5,
        0,
        (98 + 3 * Math.sqrt(397 / 2)) / 5
      )
    ]);
  });
});
