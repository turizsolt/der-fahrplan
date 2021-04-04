import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { PositionOnTrack2 } from '../../src/modules/Train/PositionOnTrack2';
import { TrackDirection } from '../../src/modules/Track/TrackDirection';
import { createTrack } from '../Track/util';
chai.use(chaiAlmost());

describe('PositionOnTrack2', () => {
  it('create a PoT', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, TrackDirection.AB);
    expect(pot).not.equals(null);
  });

  it('reverse a PoT', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, TrackDirection.AB);
    expect(pot.getPosition()).equals(0);
    expect(pot.getDirection()).equals(TrackDirection.AB);
    pot.reverse();
    expect(pot.getPosition()).equals(track.getLength());
    expect(pot.getDirection()).equals(TrackDirection.BA);
  });

  it('reverse of reverse is idempotent', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, TrackDirection.AB);
    pot.reverse();
    pot.reverse();
    expect(pot.getPosition()).equals(0);
    expect(pot.getDirection()).equals(TrackDirection.AB);
  });
});
