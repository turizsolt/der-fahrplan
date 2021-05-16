import { DirectedTrack } from './DirectedTrack';
import { TrackSegment } from './TrackSegment';
import { TrackBase } from './TrackBase';
import { TrackJointEnd } from './TrackJoint/TrackJointEnd';

export interface TrackEnd {
  getSegment(): TrackSegment;
  getTrack(): TrackBase;
  getStart(): DirectedTrack;
  getEnd(): DirectedTrack;
  getJointEnd(): TrackJointEnd;
  connect(): void;
  disconnect(): void;
  permaConnect(): void;
  permaDisconnect(): void;
  persist(): any;
}
