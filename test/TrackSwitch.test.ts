import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from './inversify.config';
import { TYPES } from '../src/structs/TYPES';
import { Track } from '../src/structs/Track/Track';
import { Coordinate } from '../src/structs/Geometry/Coordinate';
import { TrackSwitch } from '../src/structs/TrackSwitch/TrackSwitch';
import { Ray } from '../src/structs/Geometry/Ray';
import { Left } from '../src/structs/Geometry/Directions';
chai.use(chaiAlmost(0.00001));

const TrackFactory = testContainer.get<() => Track>(TYPES.FactoryOfTrack);
const TrackSwitchFactory = testContainer.get<() => TrackSwitch>(
  TYPES.FactoryOfTrackSwitch
);

const p1 = new Coordinate(0, 0, 0);
const p2 = new Coordinate(50, 0, 0);
const p3 = new Coordinate(50, 0, 40);
const p3b = new Coordinate(10, 0, 0);

xdescribe('TrackSwitch', () => {
  it('split naturally', () => {
    const sw = TrackSwitchFactory().init([p1, p2], [p1, p3b, p3]);
    const [sp0, sp1, sp2] = sw.naturalSplitPoints();

    expect(sp0).deep.almost(new Ray(new Coordinate(3, 0, 0), Left));
    expect(sp1).deep.almost(new Ray(new Coordinate(10, 0, 0), Left));
    expect(sp2).deep.almost(
      new Ray(new Coordinate(9.161282656, 0, 3.806447232), 1.051650212)
    );
  });
});
