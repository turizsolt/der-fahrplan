import chai, { expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { DirectedTrack } from '../../../src/modules/Track/DirectedTrack';
import { ActualDirectedTrack } from '../../../src/modules/Track/ActualDirectedTrack';
import { TrackSegment } from '../../../src/modules/Track/TrackSegment';
import { TrackMarker } from '../../../src/modules/Track/TrackMarker';
chai.use(chaiAlmost());

const createDirectedTrack = (segment?: TrackSegment): DirectedTrack =>
  new ActualDirectedTrack(segment, null, null);

describe('DirectedTrack.Markers', () => {
  it('add a track marker', () => {
    const dt = createDirectedTrack();
    const myMarker: TrackMarker = { type: 'Train', train: null };
    dt.addMarker(7, myMarker);
    for (let marker of dt.getMarkers()) {
      expect(marker.marker).deep.equals(myMarker);
    }
  });
});
