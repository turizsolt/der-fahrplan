import { TrackCurve } from './TrackCurve';
import { TrackEnd } from './TrackEnd';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { TrackBase } from './TrackBase';
import { DirectedTrack } from './DirectedTrack';
import { TrackDirection } from './TrackDirection';

export interface TrackSegment {
  remove(): void;
  getEnd(whichEnd: WhichEnd): TrackEnd;
  getTrack(): TrackBase;
  getDirected(direction: TrackDirection): DirectedTrack;
  getLength(): number;
  getCurve(): TrackCurve;
  connect(): void;
  disconnect(): void;
}
