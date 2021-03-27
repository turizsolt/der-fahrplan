import { TrackBase } from '../TrackBase';
import { TrackEnd } from '../TrackEnd';

export class TrackJointEnd {
  public track: TrackBase = null;
  public end: TrackEnd = null;

  setEnd(track: TrackBase, end: TrackEnd) {
    this.track = track;
    this.end = end;
  }

  unsetEnd() {
    this.track = null;
    this.end = null;
  }

  isSet(): boolean {
    return !!this.track;
  }
}
