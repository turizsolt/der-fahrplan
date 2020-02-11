import { TrackBase } from '../TrackBase';
import { TrackEnd } from '../TrackEnd';

export class TrackJointEnd {
  public track: TrackBase = null;
  public end: TrackEnd = null;

  setEnd(track: TrackBase, end: TrackEnd) {
    this.track = track;
    this.end = end;
  }

  isSet(): boolean {
    return !!this.track;
  }
}
