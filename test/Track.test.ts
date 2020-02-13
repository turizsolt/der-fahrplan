import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { testContainer } from './inversify.config';
import { TYPES } from '../src/structs/TYPES';
import { Track } from '../src/structs/Track/Track';
import { Coordinate } from '../src/structs/Geometry/Coordinate';
chai.use(chaiAlmost());

const TrackFactory = testContainer.get<(coordinates: Coordinate[]) => Track>(
  TYPES.FactoryOfTrack
);

const p1 = new Coordinate(0, 0, 0);
const p2 = new Coordinate(10, 0, 0);
const p3 = new Coordinate(10, 0, 10);
const p4 = new Coordinate(10, 0, 20);
const p5 = new Coordinate(20, 0, 20);

describe('Track connection', () => {
  it('two is connected', () => {
    const t1 = TrackFactory([p1, p2, p3]);
    const t2 = TrackFactory([p3, p4, p5]);
    console.log(t1, t2);
  });
});
