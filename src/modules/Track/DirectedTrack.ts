import { TrackSegment } from './TrackSegment';

export interface DirectedTrack {
  next(): DirectedTrack;
  setNext(nextTrack: DirectedTrack): void;

  reverse(): DirectedTrack;
  setReverse(reverseTrack: DirectedTrack): void;

  getSegment(): TrackSegment;
}
