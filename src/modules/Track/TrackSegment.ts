import { TrackCurve } from './TrackCurve';
import { TrackEnd } from './TrackEnd';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { TrackBase } from './TrackBase';

export interface TrackSegment {
  remove(): void;
  getEnd(whichEnd: WhichEnd): TrackEnd;
  getTrack(): TrackBase;
  getCurve(): TrackCurve;
  connect(): void;
  disconnect(): void;
}
