import { TrackSegment } from './TrackSegment';
import { DirectedTrack } from './DirectedTrack';

export class ActualDirectedTrack implements DirectedTrack {
  private nextTrack: DirectedTrack = null;
  private reverseTrack: DirectedTrack = null;

  constructor(private segment: TrackSegment) {}

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
}
