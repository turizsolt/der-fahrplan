import { TrackBase } from '../TrackBase/TrackBase';
import { TrackEnd } from '../Track/TrackEnd';

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
