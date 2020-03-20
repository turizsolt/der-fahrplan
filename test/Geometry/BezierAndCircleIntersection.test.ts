import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { Circle } from '../../src/structs/Geometry/Circle';
import { BezierQuadratic } from '../../src/structs/Geometry/Bezier/BezierQuadratic';
import { BezierLinear } from '../../src/structs/Geometry/Bezier/BezierLinear';
chai.use(chaiAlmost());

describe('Bezier and circle intersection', () => {
  it('circle and bezier line on origo', () => {
    const c = new Circle(new Coordinate(0, 0, 0), 10);
    const b = new BezierLinear([
      new Coordinate(0, 0, 0),
      new Coordinate(0, 0, 20)
    ]);

    expect(b.intersectWithCircle(c)).deep.equals([0.5]);
  });

  it('circle and bezier curve on origo', () => {
    const c = new Circle(new Coordinate(0, 0, 0), 10);
    const r2 = (Math.sqrt(2) / 2) * 10;
    const b = new BezierQuadratic([
      new Coordinate(0, 0, 0),
      new Coordinate(r2, 0, r2),
      new Coordinate(2 * r2, 0, 2 * r2)
    ]);

    expect(b.intersectWithCircle(c)).deep.equals([0.5]);
  });

  it('circle and bezier curve general', () => {
    const c = new Circle(new Coordinate(20, 0, 30), 10);
    const r2 = (Math.sqrt(2) / 2) * 10;
    const b = new BezierQuadratic([
      new Coordinate(20, 0, 30),
      new Coordinate(20 + r2, 0, 30 + r2),
      new Coordinate(20 + 2 * r2, 0, 30 + 2 * r2)
    ]);

    expect(b.intersectWithCircle(c)).deep.equals([0.5]);
  });
});
