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
});
