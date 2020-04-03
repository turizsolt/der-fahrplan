import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../src/di/test.config';
import { TYPES } from '../../src/di/TYPES';
import { Track } from '../../src/structs/Interfaces/Track';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { Wagon } from '../../src/structs/Interfaces/Wagon';
import { WhichEnd } from '../../src/structs/Interfaces/WhichEnd';
chai.use(chaiAlmost());

const TrackFactory = testContainer.get<() => Track>(TYPES.FactoryOfTrack);
const WagonFactory = testContainer.get<() => Wagon>(TYPES.FactoryOfWagon);

describe('Nearest wagon on track', () => {
  it('forward on the same track', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0, 1);
    const w2 = WagonFactory().init();
    w2.putOnTrack(t, 0.2, 1);

    const nearest = w1.getNearestWagon(WhichEnd.B);

    expect(nearest).deep.equals({
      distance: 0.06,
      wagon: w2,
      end: w2.getA()
    });
  });

  it('forward on the same track (from multiple)', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0, 1);
    const w2 = WagonFactory().init();
    w2.putOnTrack(t, 0.5, 1);
    const w3 = WagonFactory().init();
    w3.putOnTrack(t, 0.3, 1);

    const nearest = w1.getNearestWagon(WhichEnd.B);

    expect(nearest).deep.almost({
      distance: 0.16,
      wagon: w3,
      end: w3.getA()
    });
  });

  it('forward on the same track (nobody there)', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0, 1);

    const nearest = w1.getNearestWagon(WhichEnd.B);

    expect(nearest).equals(null);
  });

  it('forward on the same track (nobody there, just backwards)', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0.5, 1);

    const w2 = WagonFactory().init();
    w2.putOnTrack(t, 0.2, 1);

    const nearest = w1.getNearestWagon(WhichEnd.B);

    expect(nearest).equals(null);
  });

  it('forward on the next track', () => {
    const t1 = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const t2 = TrackFactory().init([
      new Coordinate(100, 0, 0),
      new Coordinate(200, 0, 0)
    ]);
    t1.getB().connect(t2.getA());

    const w1 = WagonFactory().init();
    w1.putOnTrack(t1, 0, 1);
    const w2 = WagonFactory().init();
    w2.putOnTrack(t2, 0.2, 1);

    const nearest = w1.getNearestWagon(WhichEnd.B);

    expect(nearest).deep.equals({
      distance: 0.86 + 0.2,
      wagon: w2,
      end: w2.getA()
    });
  });

  it('backward on the prev track', () => {
    const t1 = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const t2 = TrackFactory().init([
      new Coordinate(100, 0, 0),
      new Coordinate(200, 0, 0)
    ]);
    t1.getB().connect(t2.getA());

    const w1 = WagonFactory().init();
    w1.putOnTrack(t1, 0, 1);
    const w2 = WagonFactory().init();
    w2.putOnTrack(t2, 0.2, 1);

    const nearest = w2.getNearestWagon(WhichEnd.A);

    expect(nearest).deep.equals({
      distance: 0.86 + 0.2,
      wagon: w1,
      end: w1.getB()
    });
  });

  it('backward on the prev track, prev track has opposite direction', () => {
    const t1 = TrackFactory().init([
      new Coordinate(100, 0, 0),
      new Coordinate(0, 0, 0)
    ]);
    const t2 = TrackFactory().init([
      new Coordinate(100, 0, 0),
      new Coordinate(200, 0, 0)
    ]);
    t1.getA().connect(t2.getA());

    const w1 = WagonFactory().init();
    w1.putOnTrack(t1, 0.86, 1);
    const w2 = WagonFactory().init();
    w2.putOnTrack(t2, 0.2, 1);

    const nearest = w2.getNearestWagon(WhichEnd.A);

    expect(nearest).deep.equals({
      distance: 0.86 + 0.2,
      wagon: w1,
      end: w1.getA()
    });
  });
});
