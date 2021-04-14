import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { ActualTrackOcupancy } from '../../../src/modules/Track/ActualTrackOcupancy';
import { getTestStore } from '../../getTestStore';
import { TYPES } from '../../../src/di/TYPES';
import { Train } from '../../../src/modules/Train/Train';
import { ActualDirectedTrack } from '../../../src/modules/Track/ActualDirectedTrack';
import { TrackMarker } from '../../../src/modules/Track/TrackMarker';
import { MarkerIterator } from '../../../src/modules/Train/MarkerIterator';
import { PositionOnTrack } from '../../../src/modules/Train/PositionOnTrack';
chai.use(chaiAlmost());

const store = getTestStore();
const train: Train = store.create<Train>(TYPES.Train).init(null, []);
const train2: Train = store.create<Train>(TYPES.Train).init(null, []);

describe('MarkerIterator', () => {
  it('iterating', () => {
    const dt = new ActualDirectedTrack(null, null, null);
    const dt2 = new ActualDirectedTrack(null, null, null);
    const dt3 = new ActualDirectedTrack(null, null, null);
    dt.setNext(dt2);
    dt2.setNext(dt3);

    const nothing1: TrackMarker = { type: 'Nothing' };
    const nothing2: TrackMarker = { type: 'Nothing' };
    const nothing3: TrackMarker = { type: 'Nothing2' };

    dt.addMarker(3, nothing1);
    dt.addMarker(4, nothing2);
    dt3.addMarker(5, nothing3);

    const iter = new MarkerIterator(dt);
    expect(iter.next()).equals(nothing1);
    expect(iter.next()).equals(nothing2);
    expect(iter.next()).equals(nothing3);
    expect(iter.next()).equals(undefined);
    expect(iter.next()).equals(undefined);

    const iter2 = new MarkerIterator(dt);
    expect(iter2.nextOf('Nothing2')).equals(nothing3);
    expect(iter2.nextOf('Nothing2')).equals(undefined);
    expect(iter2.nextOf('Nothing2')).equals(undefined);

    const iter3 = new MarkerIterator(dt, 3.5, dt3, 4);
    expect(iter3.next()).equals(nothing2);
    expect(iter3.next()).equals(undefined);
    expect(iter3.next()).equals(undefined);
  });
});
