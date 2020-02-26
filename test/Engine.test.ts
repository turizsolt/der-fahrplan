import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from './inversify.config';
import { TYPES } from '../src/structs/TYPES';
import { Track } from '../src/structs/Track/Track';
import { Coordinate } from '../src/structs/Geometry/Coordinate';
import { TrackSwitch } from '../src/structs/TrackSwitch/TrackSwitch';
import { Engine } from '../src/structs/Engine/Engine';
chai.use(chaiAlmost());

const TrackFactory = testContainer.get<() => Track>(TYPES.FactoryOfTrack);
const TrackSwitchFactory = testContainer.get<() => TrackSwitch>(
  TYPES.FactoryOfTrackSwitch
);
const EngineFactory = testContainer.get<() => Engine>(TYPES.FactoryOfEngine);

const p1 = new Coordinate(0, 0, 0);
const p2 = new Coordinate(10, 0, 0);
const p2i = new Coordinate(15, 0, 0);
const p2b = new Coordinate(20, 10, 0);
const p3 = new Coordinate(20, 0, 0);

describe('Engine', () => {
  it('moves forward', () => {
    const t = TrackFactory().init([p1, p2]);
    const e = EngineFactory();

    e.putOnTrack(t);
    e.forward();

    expect(e.getPosition()).deep.equals(new Coordinate(1, 0, 0));
  });

  it('stays on track forward', () => {
    const t = TrackFactory().init([p1, p2]);
    const e = EngineFactory();

    e.putOnTrack(t);
    for (let i = 0; i < 11; i++) {
      e.forward();
    }

    expect(e.getPosition()).deep.equals(new Coordinate(10, 0, 0));
  });

  it('moves backward', () => {
    const t = TrackFactory().init([p1, p2]);
    const e = EngineFactory();

    e.putOnTrack(t);
    e.forward();
    e.backward();

    expect(e.getPosition()).deep.equals(new Coordinate(0, 0, 0));
  });

  it('stays on track backward', () => {
    const t = TrackFactory().init([p1, p2]);
    const e = EngineFactory();

    e.putOnTrack(t);
    e.forward();
    e.backward();
    e.backward();

    expect(e.getPosition()).deep.equals(new Coordinate(0, 0, 0));
  });

  it('moves to next track', () => {
    const t1 = TrackFactory().init([p1, p2]);
    const t2 = TrackFactory().init([p2, p3]);
    t1.getB().connect(t2.getA());

    const e = EngineFactory();
    e.putOnTrack(t1);

    expect(e.getPosition()).deep.equals(new Coordinate(0, 0, 0));
    expect(e.getTrackOn()).equals(t1);

    for (let i = 0; i < 11; i++) {
      e.forward();
    }

    expect(e.getPosition()).deep.equals(new Coordinate(11, 0, 0));
    expect(e.getTrackOn()).equals(t2);
  });

  it('moves to next, opposite direction track (forwards)', () => {
    const t1 = TrackFactory().init([p1, p2]);
    const t2 = TrackFactory().init([p3, p2]);
    t1.getB().connect(t2.getB());

    const e = EngineFactory();
    e.putOnTrack(t1);

    expect(e.getPosition()).deep.equals(new Coordinate(0, 0, 0));
    expect(e.getTrackOn()).equals(t1);

    for (let i = 0; i < 16; i++) {
      e.forward();
    }

    expect(e.getPosition()).deep.equals(new Coordinate(16, 0, 0));
    expect(e.getTrackOn()).equals(t2);
  });

  it('moves to next, opposite direction track (backwards)', () => {
    const t1 = TrackFactory().init([p2, p1]);
    const t2 = TrackFactory().init([p2, p3]);
    t1.getA().connect(t2.getA());

    const e = EngineFactory();
    e.putOnTrack(t1);

    for (let i = 0; i < 10; i++) {
      e.forward();
    }

    expect(e.getPosition()).deep.equals(new Coordinate(0, 0, 0));
    expect(e.getTrackOn()).equals(t1);

    for (let i = 0; i < 16; i++) {
      e.backward();
    }

    expect(e.getPosition()).deep.equals(new Coordinate(16, 0, 0));
    expect(e.getTrackOn()).equals(t2);
  });

  it('cannot enter the switch, if switched to the wrong side, cannot switch when on the switch', () => {
    const t = TrackFactory().init([p2, p3]);
    const s = TrackSwitchFactory().init([p1, p2], [p1, p2i, p2b]);
    s.getF().connect(t.getA());

    const e = EngineFactory();
    e.putOnTrack(t);

    expect(e.getPosition()).deep.equals(new Coordinate(10, 0, 0));
    expect(e.getTrackOn()).equals(t);

    e.backward();

    expect(e.getPosition()).deep.equals(new Coordinate(10, 0, 0));
    expect(e.getTrackOn()).equals(t);

    s.switch();
    e.backward();

    expect(e.getPosition()).deep.equals(new Coordinate(9, 0, 0));
    expect(e.getTrackOn()).equals(s);

    expect(s.getState()).equals(1);
    s.switch();
    expect(s.getState()).equals(1);

    e.forward();
    e.forward();

    s.switch();
    expect(s.getState()).equals(0);
  });
});
