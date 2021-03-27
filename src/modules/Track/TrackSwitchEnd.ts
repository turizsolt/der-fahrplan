import { TrackEnd } from './TrackEnd';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { TrackBase } from './TrackBase';
import { WhichTrackEnd } from '../../structs/Interfaces/WhichTrackEnd';

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
