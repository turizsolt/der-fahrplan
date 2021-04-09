import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { PositionOnTrack } from '../../../src/modules/Train/PositionOnTrack';
import { createTrack, createTrackLine } from '../Track/util';
import { TrackDirection } from '../../../src/modules/Track/TrackDirection';
import { Nearest } from '../../../src/modules/Train/Nearest';
chai.use(chaiAlmost());

describe('Nearest', () => {
  it('nearest end is here', () => {
    const { track } = createTrack(100);
    const pot = new PositionOnTrack(track, 100, TrackDirection.AB);
    expect(Nearest.find(pot).end).deep.equals({
      distance: 0,
      segmentCount: 1
    });
  });

  it('nearest end is inside the track', () => {
    const { track } = createTrack(100);
    const pot = new PositionOnTrack(track, 80, TrackDirection.AB);
    expect(Nearest.find(pot).end).deep.equals({
      distance: 20,
      segmentCount: 1
    });
  });

  it('nearest end is far away', () => {
    const {
      track: [track1]
    } = createTrackLine(4, 100);
    const pot = new PositionOnTrack(track1, 80, TrackDirection.AB);
    expect(Nearest.find(pot).end).deep.equals({
      distance: 220,
      segmentCount: 3
    });
  });
});
