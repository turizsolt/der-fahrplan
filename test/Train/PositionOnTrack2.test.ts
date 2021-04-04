import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { PositionOnTrack2 } from '../../src/modules/Train/PositionOnTrack2';
import { createTrack } from '../Track/Track.test';
import { TrackDirection } from '../../src/modules/Track/TrackDirection';
chai.use(chaiAlmost());

describe('PositionOnTrack2', () => {
  it('create a PoT', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, TrackDirection.AB);
    expect(pot).not.equals(null);
  });
});
