import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../inversify.config';
import { TYPES } from '../../src/structs/TYPES';
import { Track } from '../../src/structs/Interfaces/Track';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { Wagon } from '../../src/structs/Interfaces/Wagon';
chai.use(chaiAlmost());

const TrackFactory = testContainer.get<() => Track>(TYPES.FactoryOfTrack);
const WagonFactory = testContainer.get<() => Wagon>(TYPES.FactoryOfWagon);

describe('Check-in on track', () => {
  it('one wagon put on one track', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(25, 0, 0)
    ]);
    const w = WagonFactory().init();
    w.putOnTrack(t, 0.2, 1);

    expect(t.getCheckedList()).deep.equals([w]);
  });

  it('one wagon put on two tracks', () => {
    const t1 = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(25, 0, 0)
    ]);
    const t2 = TrackFactory().init([
      new Coordinate(25, 0, 0),
      new Coordinate(50, 0, 0)
    ]);
    t1.getB().connect(t2.getA());

    const w = WagonFactory().init();
    w.putOnTrack(t1, 0.8, 1);

    expect(t1.getCheckedList()).deep.equals([w]);
    expect(t2.getCheckedList()).deep.equals([w]);
  });

  it('one wagon on a track, and moves forward', () => {
    const t1 = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(25, 0, 0)
    ]);
    const t2 = TrackFactory().init([
      new Coordinate(25, 0, 0),
      new Coordinate(50, 0, 0)
    ]);
    t1.getB().connect(t2.getA());

    const w = WagonFactory().init();
    w.putOnTrack(t1, 0.8, 1);

    expect(t1.getCheckedList()).deep.equals([w]);
    expect(t2.getCheckedList()).deep.equals([w]);

    w.moveTowardsWagonB(20);

    expect(t1.getCheckedList()).deep.equals([]);
    expect(t2.getCheckedList()).deep.equals([w]);
  });

  it('one wagon on a track, and moves backward', () => {
    const t1 = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(25, 0, 0)
    ]);
    const t2 = TrackFactory().init([
      new Coordinate(25, 0, 0),
      new Coordinate(50, 0, 0)
    ]);
    t1.getB().connect(t2.getA());

    const w = WagonFactory().init();
    w.putOnTrack(t2, 0.2, 1);

    expect(t1.getCheckedList()).deep.equals([]);
    expect(t2.getCheckedList()).deep.equals([w]);

    w.moveTowardsWagonA(20);

    expect(t1.getCheckedList()).deep.equals([w]);
    expect(t2.getCheckedList()).deep.equals([]);
  });

  it('one wagon put on one track and removed', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(25, 0, 0)
    ]);
    const w = WagonFactory().init();
    w.putOnTrack(t, 0.2, 1);

    expect(t.getCheckedList()).deep.equals([w]);

    w.remove();

    expect(t.getCheckedList()).deep.equals([]);
  });

  it('two wagons put on one track', () => {
    const t = TrackFactory().init([
      new Coordinate(0, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const w1 = WagonFactory().init();
    w1.putOnTrack(t, 0.2, 1);

    const w2 = WagonFactory().init();
    w2.putOnTrack(t, 0.4, 1);

    expect(t.getCheckedList()).deep.equals([w1, w2]);
  });
});
