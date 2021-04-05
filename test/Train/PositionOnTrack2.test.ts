import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { PositionOnTrack2 } from '../../src/modules/Train/PositionOnTrack2';
import { TrackDirection } from '../../src/modules/Track/TrackDirection';
import {
  createTrack,
  createTrackLine,
  createCurlyZigZagTrackLine
} from '../Track/util';
chai.use(chaiAlmost());

const AB = TrackDirection.AB;
const BA = TrackDirection.BA;

describe('PositionOnTrack2', () => {
  it('create a PoT', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, AB);
    expect(pot).not.equals(null);
  });

  it('reverse a PoT', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, AB);
    expect(pot.getPosition()).equals(0);
    expect(pot.getDirectedTrack()).equals(track.getDirected(AB));
    pot.reverse();
    expect(pot.getPosition()).equals(track.getLength());
    expect(pot.getDirectedTrack()).equals(track.getDirected(BA));
  });

  it('reverse of reverse is idempotent', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, AB);
    pot.reverse();
    pot.reverse();
    expect(pot.getPosition()).equals(0);
    expect(pot.getDirectedTrack()).equals(track.getDirected(AB));
  });

  it('moving a PoT inside a track', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, AB);
    expect(pot.getPosition()).equals(0);
    pot.move(10);
    expect(pot.getPosition()).equals(10);
  });

  it('moving a PoT to a next, next track', () => {
    const {
      track: [track1, track2, track3]
    } = createTrackLine(4, 10);
    const pot = new PositionOnTrack2(track1, 5, AB);
    expect(pot.getPosition()).equals(5);
    expect(pot.getTrack()).equals(track1);
    pot.move(21);
    expect(pot.getPosition()).equals(6);
    expect(pot.getTrack()).equals(track3);
  });

  it('moving a PoT beyond the last track', () => {
    const {
      track: [track1, track2]
    } = createTrackLine(3, 10);
    const pot = new PositionOnTrack2(track1, 5, AB);
    expect(pot.getPosition()).equals(5);
    expect(pot.getTrack()).equals(track1);
    pot.move(100);
    expect(pot.getPosition()).equals(10);
    expect(pot.getTrack()).equals(track2);
  });

  it('hoping a PoT inside a track', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 0, AB);
    expect(pot.getPosition()).equals(0);
    pot.hop(10);
    expect(pot.getPosition()).equals(10);
  });

  it('hoping a PoT to a next, next track', () => {
    const {
      track: [track1, track2, track3]
    } = createTrackLine(4, 10);
    const pot = new PositionOnTrack2(track1, 5, AB);
    expect(pot.getPosition()).equals(5);
    expect(pot.getTrack()).equals(track1);
    pot.hop(21);
    expect(pot.getPosition()).equals(6);
    expect(pot.getTrack()).equals(track3);
  });

  it('hoping a PoT beyond the last track', () => {
    const {
      track: [track1, track2]
    } = createTrackLine(3, 10);
    const pot = new PositionOnTrack2(track1, 5, AB);
    expect(pot.getPosition()).equals(5);
    expect(pot.getTrack()).equals(track1);
    pot.hop(100);
    expect(pot.getPosition()).equals(10);
    expect(pot.getTrack()).equals(track2);
  });

  it('general tracks and hoping', () => {
    const {
      track: [track1, track2]
    } = createCurlyZigZagTrackLine(3, 100);
    const pot = new PositionOnTrack2(track1, 140, AB);
    expect(pot.getPosition()).equals(140);
    expect(pot.getTrack()).equals(track1);
    pot.hop(30);
    expect(pot.getPosition()).equals(50.93862166453321);
    expect(pot.getTrack()).equals(track2);
  });
});
