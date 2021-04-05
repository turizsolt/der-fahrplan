import { TrackSegment } from './TrackSegment';
import { DirectedTrack } from './DirectedTrack';
import { TrackBase } from './TrackBase';
import { TrackCurve } from './TrackCurve';

export class ActualDirectedTrack implements DirectedTrack {
  private nextTrack: DirectedTrack = null;
  private reverseTrack: DirectedTrack = null;

  constructor(private segment: TrackSegment, private curve: TrackCurve) {}

  next(): DirectedTrack {
    return this.nextTrack;
  }

  setNext(nextTrack: DirectedTrack): void {
    this.nextTrack = nextTrack;
  }

  reverse(): DirectedTrack {
    return this.reverseTrack;
  }

  setReverse(reverseTrack: DirectedTrack): void {
    this.reverseTrack = reverseTrack;
  }

  getSegment(): TrackSegment {
    return this.segment;
  }

  getTrack(): TrackBase {
    return this.segment.getTrack();
  }

  getCurve(): TrackCurve {
    return this.curve;
  }

  getLength(): number {
    return this.curve.getLength();
  }
}
