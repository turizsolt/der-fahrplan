import { DirectedTrack } from './DirectedTrack';
import { TrackSegment } from './TrackSegment';
import { TrackBase } from './TrackBase';
import { TrackJointEnd } from './TrackJoint/TrackJointEnd';
import { TrackEnd } from './TrackEnd';

export class ActualTrackEnd implements TrackEnd {
  constructor(
    private start: DirectedTrack,
    private end: DirectedTrack,
    private jointEnd: TrackJointEnd
  ) {}

  getSegment(): TrackSegment {
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

  permaConnect(): void {
    this.jointEnd.joint.setPermaOneEnd(this.jointEnd.end, this);
  }

  permaDisconnect(): void {
    this.jointEnd.joint.removePermaEnd(this);
  }

  persist(): Object {
    return {
      end: this.jointEnd.end,
      joint: this.jointEnd.joint.getId()
    };
  }
}
