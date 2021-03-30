import { DirectedTrack } from './DirectedTrack';
import { Track } from './Track';
import { ActualTrackSegment } from './ActualTrackSegment';

export class ActualTrackEnd {

  constructor(private start: DirectedTrack, private end: DirectedTrack) { }

  getSegment(): ActualTrackSegment {
    return this.start.getSegment();
  }

  getTrack(): Track {
    return this.start.getSegment().getTrack();
  }

  getStart(): DirectedTrack {
    return this.start;
  }

  getEnd(): DirectedTrack {
    return this.end;
  }
}
