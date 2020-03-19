import { TrackEnd } from './Track/TrackEnd';

export class TrackSwitchEnd extends TrackEnd {
  private active: boolean;

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
