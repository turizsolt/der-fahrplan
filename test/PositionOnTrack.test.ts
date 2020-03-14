import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from './inversify.config';
import { TYPES } from '../src/structs/TYPES';
import { Track } from '../src/structs/Track/Track';
import { Coordinate } from '../src/structs/Geometry/Coordinate';
import { PositionOnTrack } from '../src/structs/Engine/PositionOnTrack';
import { Ray } from '../src/structs/Geometry/Ray';
import { Right, Left } from '../src/structs/Geometry/Directions';
chai.use(chaiAlmost());

const TrackFactory = testContainer.get<() => Track>(TYPES.FactoryOfTrack);

describe('Position on track', () => {
  xit('simple move', () => {
    // no need for "move" anymore
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const p1 = new PositionOnTrack(t, null, 0, 1);
    p1.move(1);

    expect(p1.getRay()).deep.equals(new Ray(new Coordinate(1, 0, 0), Right));
  });

  it('simple hop', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const p1 = new PositionOnTrack(t, null, 0, 1);
    p1.hop(10);

    expect(p1.getRay()).deep.equals(new Ray(new Coordinate(10, 0, 0), Right));
  });

  it('simple curved hop', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(10, 0, 0),
      new Coordinate(20, 0, 10)
    ]);
    const p1 = new PositionOnTrack(t, null, 0, 1);
    p1.hop(10);

    expect(p1.getRay()).deep.almost(
      new Ray(new Coordinate(9.717365, 0, 2.360679), 1.118517)
    );
  });

  it('simple hop to the next track', () => {
    const t1 = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(10, 0, 0)
    ]);
    const t2 = TrackFactory().init([
      new Coordinate(10, 0, 0),
      new Coordinate(20, 0, 0)
    ]);
    t1.getB().connect(t2.getA());

    const p1 = new PositionOnTrack(t1, null, 0, 1);
    p1.hop(15);

    expect(p1.getRay()).deep.equals(new Ray(new Coordinate(15, 0, 0), Right));
  });

  it('simple curved hop to the next track, B->A', () => {
    const t1 = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(10, 0, 0),
      new Coordinate(20, 0, 10)
    ]);
    const t2 = TrackFactory().init([
      new Coordinate(20, 0, 10),
      new Coordinate(30, 0, 20),
      new Coordinate(40, 0, 20)
    ]);
    t1.getB().connect(t2.getA());

    const p1 = new PositionOnTrack(t1, null, 0, 1);
    p1.hop(25);

    expect(p1.getRay()).deep.almost(
      new Ray(new Coordinate(21.990674, 0, 11.891604), 0.837723)
    );
    expect(p1.getDirection()).equals(1);
  });

  it('simple curved hop to the next track, B->B', () => {
    const t1 = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(10, 0, 0),
      new Coordinate(20, 0, 10)
    ]);
    const t2 = TrackFactory().init(
      [
        new Coordinate(20, 0, 10),
        new Coordinate(30, 0, 20),
        new Coordinate(40, 0, 20)
      ].reverse()
    );
    t1.getB().connect(t2.getB());

    const p1 = new PositionOnTrack(t1, null, 0, 1);
    p1.hop(25);

    expect(p1.getRay()).deep.almost(
      new Ray(new Coordinate(21.990674, 0, 11.891604), 0.837723 - Math.PI)
    );
    expect(p1.getDirection()).equals(-1);
  });

  it('simple curved hop to the next track, but no next', () => {
    const t1 = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(10, 0, 0),
      new Coordinate(20, 0, 10)
    ]);

    const p1 = new PositionOnTrack(t1, null, 0, 1);
    p1.hop(25);

    expect(p1.getRay()).deep.almost(
      new Ray(new Coordinate(20, 0, 10), Right / 2)
    );
    expect(p1.getDirection()).equals(1);
  });

  it('simple curved hop to the next track, A->B', () => {
    const t1 = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(10, 0, 0),
      new Coordinate(20, 0, 10)
    ]);
    const t2 = TrackFactory().init([
      new Coordinate(20, 0, 10),
      new Coordinate(30, 0, 20),
      new Coordinate(40, 0, 20)
    ]);
    t1.getB().connect(t2.getA());

    const p1 = new PositionOnTrack(t2, null, 1, -1);
    p1.hop(25);

    expect(p1.getRay()).deep.almost(
      new Ray(new Coordinate(40 - 21.990674, 0, 20 - 11.891604), 0.837723)
    );
    expect(p1.getDirection()).equals(-1);
  });

  it('simple curved hop to the next track, A->A', () => {
    const t1 = TrackFactory().init(
      [
        new Coordinate(0, 0, 0),
        new Coordinate(10, 0, 0),
        new Coordinate(20, 0, 10)
      ].reverse()
    );
    const t2 = TrackFactory().init([
      new Coordinate(20, 0, 10),
      new Coordinate(30, 0, 20),
      new Coordinate(40, 0, 20)
    ]);
    t1.getA().connect(t2.getA());

    const p1 = new PositionOnTrack(t2, null, 1, -1);
    p1.hop(25);

    expect(p1.getRay()).deep.almost(
      new Ray(
        new Coordinate(40 - 21.990674, 0, 20 - 11.891604),
        0.837723 - Math.PI
      )
    );
    expect(p1.getDirection()).equals(1);
  });

  it('simple curved hop to the next track, but no next', () => {
    const t1 = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(10, 0, 0),
      new Coordinate(20, 0, 10)
    ]);

    const p1 = new PositionOnTrack(t1, null, 1, -1);
    p1.hop(25);

    expect(p1.getRay()).deep.almost(new Ray(new Coordinate(0, 0, 0), Right));
    expect(p1.getDirection()).equals(-1);
  });

  // p1.roll()
});
