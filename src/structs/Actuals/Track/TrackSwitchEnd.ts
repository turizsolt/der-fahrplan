import { TrackEnd } from './TrackEnd';
import { WhichEnd } from '../../Interfaces/WhichEnd';
import { TrackBase } from '../../Interfaces/TrackBase';
import { WhichTrackEnd } from '../../Interfaces/WhichTrackEnd';

export class TrackSwitchEnd extends TrackEnd {
  private active: boolean;
  private whichTrackEnd: WhichTrackEnd;

  constructor(which: WhichEnd, whichTrack: WhichTrackEnd, endOf: TrackBase) {
    super(which, endOf);
    this.whichTrackEnd = whichTrack;
  }

  getWhichTrackEnd(): WhichTrackEnd {
    return this.whichTrackEnd;
  }

  isActive(): boolean {
    return this.active;
  }

  setActive(active: boolean) {
    this.active = active;
    if (this.connectedEnd) {
      this.connectedEnd.update();
    }
  }
}
