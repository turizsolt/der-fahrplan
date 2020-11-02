import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from '../../../src/di/test.config';
import { Track } from '../../../src/structs/Interfaces/Track';
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

    console.log(wagon.getRay().coord.x, wagon.getSpeed());
    wagon.onSelected(true);
    wagon.accelerate();
    wagon.tick();
    console.log(wagon.getRay().coord.x, wagon.getSpeed());
    wagon.accelerate();
    wagon.tick();
    console.log(wagon.getRay().coord.x, wagon.getSpeed());
    wagon.accelerate();
    wagon.tick();
    console.log(wagon.getRay().coord.x, wagon.getSpeed());

    expect(wagon.getRay().coord.x).almost.equals(5.5);
  });
});
