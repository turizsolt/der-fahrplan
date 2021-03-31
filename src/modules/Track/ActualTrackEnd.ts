import { DirectedTrack } from './DirectedTrack';
import { ActualTrackSegment } from './ActualTrackSegment';
import { TrackBase } from './TrackBase';
import { TrackJointEnd } from './TrackJoint/TrackJointEnd';

export class ActualTrackEnd {
  constructor(
    private start: DirectedTrack,
    private end: DirectedTrack,
    private jointEnd: TrackJointEnd
  ) {}

  getSegment(): ActualTrackSegment {
    return this.start.getSegment();
  }

  getTrack(): TrackBase {
    return this.start.getSegment().getTrack();
  }

  getStart(): DirectedTrack {
    return this.start;
  }

  getEnd(): DirectedTrack {
    return this.end;
  }

  getJointEnd(): TrackJointEnd {
    return this.jointEnd;
  }

  connect(): void {
    this.jointEnd.joint.setOneEnd(this.jointEnd.end, this);
  }

  disconnect(): void {
    this.jointEnd.joint.removeEnd(this);
  }
}
