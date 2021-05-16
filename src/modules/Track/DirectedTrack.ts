import { TrackSegment } from './TrackSegment';
import { TrackBase } from './TrackBase';
import { TrackCurve } from './TrackCurve';
import { TrackDirection } from './TrackDirection';
import { TrackMarker } from './TrackMarker';
import { PositionedTrackMarker } from '../PositionedTrackMarker';

export interface DirectedTrack {
  next(): DirectedTrack;
  setNext(nextTrack: DirectedTrack): void;

  permaNexts(): DirectedTrack[];
  setPermaNexts(permaNextTracks: DirectedTrack[]): void;

  reverse(): DirectedTrack;
  setReverse(reverseTrack: DirectedTrack): void;

  getSegment(): TrackSegment;
  getTrack(): TrackBase;
  getCurve(): TrackCurve;
  getLength(): number;
  getDirection(): TrackDirection;

  addMarker(position: number, marker: TrackMarker): void;
  removeMarker(marker: TrackMarker): void;
  addMarkerBothDirections(position: number, marker: TrackMarker): void;
  removeMarkerBothDirections(marker: TrackMarker): void;
  getMarkers(): PositionedTrackMarker[];

  getHash(): string;
}
