import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../../src/di/test.config';
import { Track } from '../../../src/modules/Track/Track';
import { Wagon } from '../../../src/structs/Interfaces/Wagon';
import { TYPES } from '../../../src/di/TYPES';
import { Coordinate } from '../../../src/structs/Geometry/Coordinate';
import { getPredefinedWagonConfig } from '../../../src/structs/Actuals/Wagon/ActualWagonConfigs';
chai.use(chaiAlmost());

const TrackFactory = testContainer.get<() => Track>(TYPES.FactoryOfTrack);
const WagonFactory = testContainer.get<() => Wagon>(TYPES.FactoryOfWagon);

describe('Wagon moving', () => {
  it('forward on the same track', () => {
    const track = TrackFactory().init([
      new Coordinate(-100, 0, 0),
      new Coordinate(100, 0, 0)
    ]);
    const wagon = WagonFactory().init(getPredefinedWagonConfig('wagon'));
    wagon.putOnTrack(track, 0.5, 1);

    wagon.select();
    wagon.accelerate();
    wagon.tick();
    wagon.accelerate();
    wagon.tick();
    wagon.accelerate();
    wagon.tick();

    expect(wagon.getRay().coord.x).almost.equals(5.5);
  });
});
