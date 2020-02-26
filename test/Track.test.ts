import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from './inversify.config';
import { TYPES } from '../src/structs/TYPES';
import { Track } from '../src/structs/Track/Track';
import { Coordinate } from '../src/structs/Geometry/Coordinate';
import { TrackSwitch } from '../src/structs/TrackSwitch/TrackSwitch';
chai.use(chaiAlmost());

const TrackFactory = testContainer.get<() => Track>(TYPES.FactoryOfTrack);
const TrackSwitchFactory = testContainer.get<() => TrackSwitch>(
  TYPES.FactoryOfTrackSwitch
);

const p1 = new Coordinate(0, 0, 0);
const p2 = new Coordinate(10, 0, 0);
const p3 = new Coordinate(10, 0, 10);
const p4 = new Coordinate(10, 0, 20);
const p5 = new Coordinate(20, 0, 20);
const p6 = new Coordinate(20, 0, 30);
const p3b = new Coordinate(10, 0, 30);
const p4b = new Coordinate(10, 0, 40);
const p3c = new Coordinate(10, 0, 35);
const p2c = new Coordinate(0, 0, 30);

describe('Track connection', () => {
  it('two track are connected', () => {
    const t1 = TrackFactory().init([p1, p2, p3]);
    const t2 = TrackFactory().init([p3, p4, p5]);

    t1.getB().connect(t2.getA());

    expect(t1.getB().getConnectedEnd()).equals(t2.getA());
    expect(t2.getA().getConnectedEnd()).equals(t1.getB());
  });

  it('two track are disconnected', () => {
    const t1 = TrackFactory().init([p1, p2, p3]);
    const t2 = TrackFactory().init([p3, p4, p5]);

    t1.getB().connect(t2.getA());
    t2.getA().disconnect();

    expect(t1.getB().getConnectedEnd()).equals(null);
    expect(t2.getA().getConnectedEnd()).equals(null);
  });

  it('track, switch are connected', () => {
    const t = TrackFactory().init([p1, p2, p3]);
    const s = TrackSwitchFactory().init([p3, p4, p5], [p3, p3b]);

    t.getB().connect(s.getA());

    expect(t.getB().getConnectedEnd()).equals(s.getA());
    expect(s.getA().getConnectedEnd()).equals(t.getB());
  });

  it('switch and two tracks are connected', () => {
    const s = TrackSwitchFactory().init([p3, p4, p5], [p3, p3b]);
    const t1 = TrackFactory().init([p3b, p4b]);
    const t2 = TrackFactory().init([p5, p6]);

    s.getE().connect(t1.getA());
    s.getF().connect(t2.getA());

    expect(s.getB().getConnectedEnd()).equals(t1.getA());
    expect(t1.getA().getConnectedEnd()).equals(s.getB());
    expect(t1.getA().getConnectedTrack()).equals(s.getB().getTrack());

    expect(t2.getA().getConnectedEnd()).equals(s.getF());
    expect(t2.getA().getConnectedTrack()).equals(null);

    s.switch();

    expect(s.getB().getConnectedEnd()).equals(t2.getA());
    expect(t1.getA().getConnectedEnd()).equals(s.getE());
    expect(t1.getA().getConnectedTrack()).equals(null);

    expect(t2.getA().getConnectedEnd()).equals(s.getB());
    expect(t2.getA().getConnectedTrack()).equals(s.getB().getTrack());
  });

  it('switch and opposing are connected', () => {
    const s1 = TrackSwitchFactory().init([p3, p4, p5], [p3, p3b]);
    const s2 = TrackSwitchFactory().init([p4b, p3b], [p4b, p3c, p2c]);

    s1.getF().connect(s2.getE());
    s1.switch();

    expect(s1.getF().getConnectedEnd()).equals(s2.getE());
    expect(s2.getE().getConnectedEnd()).equals(s1.getF());

    s1.switch();
    s2.switch();

    expect(s1.getF().getConnectedEnd()).equals(s2.getE());
    expect(s2.getE().getConnectedEnd()).equals(s1.getF());

    expect(s1.getF().getConnectedTrack()).equals(null);
    expect(s2.getE().getConnectedTrack()).equals(null);
  });
});

// TODO atgondolni mi miert hasal el az uj rendszerben
