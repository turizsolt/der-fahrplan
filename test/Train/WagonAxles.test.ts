import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { PositionOnTrack2 } from '../../src/modules/Train/PositionOnTrack2';
import { createTrack } from '../Track/util';
import { TrackDirection } from '../../src/modules/Track/TrackDirection';
import { getTestStore } from '../getTestStore';
import { WagonAxles } from '../../src/modules/Train/WagonAxles';
import { ActualWagonAxles } from '../../src/modules/Train/ActualWagonAxles';
import { WhichEnd } from '../../src/structs/Interfaces/WhichEnd';
chai.use(chaiAlmost());

const store = getTestStore();

describe('WagonAxles', () => {
  it('create, get and set WagonAxles', () => {
    const { track } = createTrack();
    const pot = new PositionOnTrack2(track, 14, TrackDirection.AB);
    const pot2 = new PositionOnTrack2(track, 0, TrackDirection.AB);
    const wagonAxles: WagonAxles = new ActualWagonAxles();
    wagonAxles.setAxlePosition(WhichEnd.A, pot);
    wagonAxles.setAxlePosition(WhichEnd.B, pot2);
    wagonAxles.setFacing(TrackDirection.AB);
    expect(wagonAxles.getAxlePosition(WhichEnd.A)).equals(pot);
    expect(wagonAxles.getAxlePosition(WhichEnd.B)).equals(pot2);
    expect(wagonAxles.getFacing()).equals(TrackDirection.AB);
  });
});
