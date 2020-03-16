import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from './inversify.config';
import { TYPES } from '../src/structs/TYPES';
import { Track } from '../src/structs/Track/Track';
import { Coordinate } from '../src/structs/Geometry/Coordinate';
import { Wagon } from '../src/structs/Engine/Wagon';
chai.use(chaiAlmost());

const TrackFactory = testContainer.get<() => Track>(TYPES.FactoryOfTrack);
const WagonFactory = testContainer.get<() => Wagon>(TYPES.FactoryOfWagon);

const perc = end => {
  return end.getPositionOnTrack().getPercentage();
};

describe('Pulling wagon', () => {
  it('going <-BA', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0.2, 1);
    w1.swapEnds();

    w1.moveTowardsWagonB(10);

    expect(perc(w1.getA())).almost(0.24);
    expect(perc(w1.getB())).almost(0.1);
  });

  it('going BA->', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0.2, 1);
    w1.swapEnds();

    w1.moveTowardsWagonA(10);

    expect(perc(w1.getA())).almost(0.44);
    expect(perc(w1.getB())).almost(0.3);
  });

  it('pulling ABAB->', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0, 1);
    const w2 = WagonFactory().init();
    w2.putOnTrack(t, 0.15, 1);
    w1.getB().connect(w2.getA());

    w2.moveTowardsWagonB(10);

    expect(perc(w1.getA())).almost(0.1);
    expect(perc(w1.getB())).almost(0.24);
    expect(perc(w2.getA())).almost(0.25);
    expect(perc(w2.getB())).almost(0.39);
  });

  it('pulling <-ABAB', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0.1, 1);
    const w2 = WagonFactory().init();
    w2.putOnTrack(t, 0.25, 1);
    w1.getB().connect(w2.getA());

    w1.moveTowardsWagonA(10);

    expect(perc(w1.getA())).almost(0);
    expect(perc(w1.getB())).almost(0.14);
    expect(perc(w2.getA())).almost(0.15);
    expect(perc(w2.getB())).almost(0.29);
  });

  it('pulling ABBA->', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0, 1);
    const w2 = WagonFactory().init();
    w2.putOnTrack(t, 0.15, 1);

    w2.swapEnds();
    w1.getB().connect(w2.getB());

    w2.moveTowardsWagonA(10);

    expect(perc(w1.getA())).almost(0.1);
    expect(perc(w1.getB())).almost(0.24);
    expect(perc(w2.getB())).almost(0.25);
    expect(perc(w2.getA())).almost(0.39);
  });

  it('pulling BAAB->', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0, 1);
    const w2 = WagonFactory().init();
    w2.putOnTrack(t, 0.15, 1);

    w1.swapEnds();
    w1.getA().connect(w2.getA());

    w2.moveTowardsWagonB(10);

    expect(perc(w1.getB())).almost(0.1);
    expect(perc(w1.getA())).almost(0.24);
    expect(perc(w2.getA())).almost(0.25);
    expect(perc(w2.getB())).almost(0.39);
  });

  it('pulling ABABABAB->', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0, 1);
    const w2 = WagonFactory().init();
    w2.putOnTrack(t, 0.15, 1);
    const w3 = WagonFactory().init();
    w3.putOnTrack(t, 0.3, 1);
    const w4 = WagonFactory().init();
    w4.putOnTrack(t, 0.45, 1);
    w1.getB().connect(w2.getA());
    w2.getB().connect(w3.getA());
    w3.getB().connect(w4.getA());

    w4.moveTowardsWagonB(10);

    expect(perc(w1.getA())).almost(0.1);
    expect(perc(w1.getB())).almost(0.24);
    expect(perc(w2.getA())).almost(0.25);
    expect(perc(w2.getB())).almost(0.39);
    expect(perc(w3.getA())).almost(0.4);
    expect(perc(w3.getB())).almost(0.54);
    expect(perc(w4.getA())).almost(0.55);
    expect(perc(w4.getB())).almost(0.69);
  });

  it('pulling <-ABABABAB', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0.1, 1);
    const w2 = WagonFactory().init();
    w2.putOnTrack(t, 0.25, 1);
    const w3 = WagonFactory().init();
    w3.putOnTrack(t, 0.4, 1);
    const w4 = WagonFactory().init();
    w4.putOnTrack(t, 0.55, 1);
    w1.getB().connect(w2.getA());
    w2.getB().connect(w3.getA());
    w3.getB().connect(w4.getA());

    w1.moveTowardsWagonA(10);

    expect(perc(w1.getA())).almost(0);
    expect(perc(w1.getB())).almost(0.14);
    expect(perc(w2.getA())).almost(0.15);
    expect(perc(w2.getB())).almost(0.29);
    expect(perc(w3.getA())).almost(0.3);
    expect(perc(w3.getB())).almost(0.44);
    expect(perc(w4.getA())).almost(0.45);
    expect(perc(w4.getB())).almost(0.59);
  });

  it('pulling <-ABBAABBA', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0.1, 1);
    const w2 = WagonFactory().init();
    w2.putOnTrack(t, 0.25, 1);
    w2.swapEnds();
    const w3 = WagonFactory().init();
    w3.putOnTrack(t, 0.4, 1);
    const w4 = WagonFactory().init();
    w4.putOnTrack(t, 0.55, 1);
    w4.swapEnds();

    w1.getB().connect(w2.getB());
    w2.getA().connect(w3.getA());
    w3.getB().connect(w4.getB());

    w1.moveTowardsWagonA(10);

    expect(perc(w1.getA())).almost(0);
    expect(perc(w1.getB())).almost(0.14);
    expect(perc(w2.getB())).almost(0.15);
    expect(perc(w2.getA())).almost(0.29);
    expect(perc(w3.getA())).almost(0.3);
    expect(perc(w3.getB())).almost(0.44);
    expect(perc(w4.getB())).almost(0.45);
    expect(perc(w4.getA())).almost(0.59);
  });
});
