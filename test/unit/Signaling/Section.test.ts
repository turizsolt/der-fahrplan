import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { getTestStore } from '../../getTestStore';
import { TYPES } from '../../../src/di/TYPES';
import { PositionOnTrack } from '../../../src/modules/Train/PositionOnTrack';
import { createTrack } from '../Track/util';
import { TrackDirection } from '../../../src/modules/Track/TrackDirection';
import { BlockJoint } from '../../../src/modules/Signaling/BlockJoint';
import { Section } from '../../../src/modules/Signaling/Section';
import { WhichEnd } from '../../../src/structs/Interfaces/WhichEnd';
import { Train } from '../../../src/modules/Train/Train';
chai.use(chaiAlmost());

const store = getTestStore();

const createSection = () => {
  const { track } = createTrack(100);
  const pos2 = PositionOnTrack.fromTrack(track, 20, TrackDirection.AB);
  const pos8 = PositionOnTrack.fromTrack(track, 80, TrackDirection.AB);
  const bj2 = store.create<BlockJoint>(TYPES.BlockJoint).init(pos2);
  const bj8 = store.create<BlockJoint>(TYPES.BlockJoint).init(pos8);
  const section = store
    .create<Section>(TYPES.Section)
    .init({ joint: bj2, end: WhichEnd.B }, { joint: bj8, end: WhichEnd.A });

  return { track, pos2, pos8, section };
};

describe('Section', () => {
  it('creates a section', () => {
    const { section } = createSection();
    expect(section).not.equals(undefined);
  });

  it('section is free from both sides', () => {
    const { section } = createSection();
    expect(section.isFree(TrackDirection.AB)).equals(true);
    expect(section.isFree(TrackDirection.BA)).equals(true);
    expect(section.getDirection()).equals(undefined);
  });

  it('section checkin from A', () => {
    const { section } = createSection();
    const train = store.create<Train>(TYPES.Train);
    section.checkin(WhichEnd.A, train);
    expect(section.isFree(TrackDirection.AB)).equals(true);
    expect(section.isFree(TrackDirection.BA)).equals(false);
    expect(section.getDirection()).equals(TrackDirection.AB);
  });

  it('section checkin from B', () => {
    const { section } = createSection();
    const train = store.create<Train>(TYPES.Train);
    section.checkin(WhichEnd.B, train);
    expect(section.isFree(TrackDirection.AB)).equals(false);
    expect(section.isFree(TrackDirection.BA)).equals(true);
    expect(section.getDirection()).equals(TrackDirection.BA);
  });

  it('section direction not changes, when there is already somebody', () => {
    const { section } = createSection();
    const train = store.create<Train>(TYPES.Train);
    const train2 = store.create<Train>(TYPES.Train);
    section.checkin(WhichEnd.B, train);
    section.checkin(WhichEnd.A, train2);
    expect(section.isFree(TrackDirection.AB)).equals(false);
    expect(section.isFree(TrackDirection.BA)).equals(true);
    expect(section.getDirection()).equals(TrackDirection.BA);
  });

  it('section checks 2 in on one side, checks 2 out, the checks in from the other side', () => {
    const { section } = createSection();
    const train = store.create<Train>(TYPES.Train);
    const train2 = store.create<Train>(TYPES.Train);
    const train3 = store.create<Train>(TYPES.Train);
    section.checkin(WhichEnd.A, train);
    section.checkin(WhichEnd.A, train2);
    section.checkout(train);
    section.checkout(train2);
    section.checkin(WhichEnd.B, train3);
    expect(section.isFree(TrackDirection.AB)).equals(false);
    expect(section.isFree(TrackDirection.BA)).equals(true);
    expect(section.getDirection()).equals(TrackDirection.BA);
  });

  it('section set direction to permanent', () => {
    const { section } = createSection();
    const train = store.create<Train>(TYPES.Train);
    section.checkin(WhichEnd.B, train);
    section.setDirectionPermanent(true);
    section.checkout(train);
    expect(section.isDirectionPermanent()).equals(true);
    expect(section.isFree(TrackDirection.AB)).equals(false);
    expect(section.isFree(TrackDirection.BA)).equals(true);
    expect(section.getDirection()).equals(TrackDirection.BA);
  });

  it('section set direction to not permanent, when sb checked in', () => {
    const { section } = createSection();
    const train = store.create<Train>(TYPES.Train);
    section.checkin(WhichEnd.B, train);
    section.setDirectionPermanent(true);
    section.setDirectionPermanent(false);
    expect(section.isDirectionPermanent()).equals(false);
    expect(section.getDirection()).equals(TrackDirection.BA);

    section.checkout(train);
    expect(section.getDirection()).equals(undefined);
  });
});
