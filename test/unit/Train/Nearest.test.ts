import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { PositionOnTrack } from '../../../src/modules/Train/PositionOnTrack';
import { createTrack } from '../Track/util';
import { TrackDirection } from '../../../src/modules/Track/TrackDirection';
import { Nearest } from '../../../src/modules/Train/Nearest';
chai.use(chaiAlmost());

describe('Nearest', () => {
  it('nearest end is here', () => {
    const { track } = createTrack(100);
    const pot = new PositionOnTrack(track, 100, TrackDirection.AB);
    expect(Nearest.find(pot)).deep.equals({
      distance: 0,
      segmentCount: 1
    });
  });
});
