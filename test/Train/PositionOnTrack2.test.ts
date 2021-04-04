import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { PositionOnTrack2 } from '../../src/modules/Train/PositionOnTrack2';
import { TrackDirection } from '../../src/modules/Track/TrackDirection';
import { createTrack, createTrackLine } from '../Track/util';
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

  it('moving a PoT inside a track', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, TrackDirection.AB);
    expect(pot.getPosition()).equals(0);
    pot.move(10);
    expect(pot.getPosition()).equals(10);
  });

  it('moving a PoT to a next track', () => {
    const {
      track: [track1, track2]
    } = createTrackLine(3, 10);
    const pot = new PositionOnTrack2(track1, 5, TrackDirection.AB);
    expect(pot.getPosition()).equals(5);
    expect(pot.getTrack()).equals(track1);
    pot.move(11);
    expect(pot.getPosition()).equals(6);
    expect(pot.getTrack()).equals(track2);
  });

  it('moving a PoT beyond the last track', () => {
    const {
      track: [track1, track2]
    } = createTrackLine(3, 10);
    const pot = new PositionOnTrack2(track1, 5, TrackDirection.AB);
    expect(pot.getPosition()).equals(5);
    expect(pot.getTrack()).equals(track1);
    pot.move(100);
    expect(pot.getPosition()).equals(10);
    expect(pot.getTrack()).equals(track2);
  });
});
