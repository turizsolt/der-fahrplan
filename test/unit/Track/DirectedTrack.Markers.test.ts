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
      expect(marker.marker).equals(myMarker);
    }
  });

  it('remove a track marker', () => {
    const dt = createDirectedTrack();
    const myMarker: TrackMarker = { type: 'Train', train: null };
    const myMarker2: TrackMarker = { type: 'Train', train: null };
    dt.addMarker(7, myMarker);
    dt.addMarker(9, myMarker2);
    dt.removeMarker(myMarker);
    for (let marker of dt.getMarkers()) {
      expect(marker.marker).equals(myMarker2);
    }
  });

  it('track markers always ordered', () => {
    const dt = createDirectedTrack();
    const myMarker: TrackMarker = { type: 'Train', train: null };
    const myMarker2: TrackMarker = { type: 'Train', train: undefined };
    const myMarker3: TrackMarker = { type: 'Train', train: null };
    dt.addMarker(11, myMarker3);
    dt.addMarker(7, myMarker);
    dt.addMarker(9, myMarker2);
    expect(dt.getMarkers().map(x => x.marker)).deep.equals([
      myMarker,
      myMarker2,
      myMarker3
    ]);
  });

  it('track marker on both directions', () => {
    const dt = createDirectedTrack();
    const dt2 = createDirectedTrack();
    dt.setReverse(dt2);
    dt.getLength = () => 100;

    const myMarker: TrackMarker = { type: 'Train', train: null };
    dt.addMarkerBothDirections(7, myMarker);
    expect(dt.getMarkers().map(x => x.marker)).deep.equals([myMarker]);
    expect(dt2.getMarkers().map(x => x.marker)).deep.equals([myMarker]);
    dt.removeMarkerBothDirections(myMarker);
    expect(dt.getMarkers().map(x => x.marker)).deep.equals([]);
    expect(dt2.getMarkers().map(x => x.marker)).deep.equals([]);
  });

  it('track marker on both directions, without reverse', () => {
    const dt = createDirectedTrack();

    const myMarker: TrackMarker = { type: 'Train', train: null };
    dt.addMarkerBothDirections(7, myMarker);
    expect(dt.getMarkers().map(x => x.marker)).deep.equals([myMarker]);
    dt.removeMarkerBothDirections(myMarker);
    expect(dt.getMarkers().map(x => x.marker)).deep.equals([]);
  });
});
