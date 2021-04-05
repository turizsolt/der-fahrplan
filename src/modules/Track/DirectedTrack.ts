import { TrackSegment } from './TrackSegment';
import { TrackBase } from './TrackBase';
import { TrackCurve } from './TrackCurve';

export interface DirectedTrack {
  next(): DirectedTrack;
  setNext(nextTrack: DirectedTrack): void;

  reverse(): DirectedTrack;
  setReverse(reverseTrack: DirectedTrack): void;

  getSegment(): TrackSegment;
  getTrack(): TrackBase;
  getCurve(): TrackCurve;
  getLength(): number;
}
