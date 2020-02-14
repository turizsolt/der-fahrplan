import { TrackSwitch } from './TrackSwitch';
import { TrackBase } from '../TrackBase/TrackBase';
import { TrackEnd } from '../Track/TrackEnd';

export class TrackSwitchEnd extends TrackEnd {
  readonly endOf: TrackSwitch;
  private phisicallyConnectedTo: TrackBase = null;
  private _phisicallyConnectedToEnd: TrackEnd = null;
  get phisicallyCconnectedToEnd() {
    return this._phisicallyConnectedToEnd;
  }
  private _active: boolean;
  set active(a: boolean) {
    this._active = a;
  }

  connect(other: TrackEnd) {
    this.phisicallyConnectedTo = other.endOf;
    this._phisicallyConnectedToEnd = other;

    if (this._active) {
      if (other.connectedTo !== this.endOf) {
        other.connect(this);
      }
      this.reconnect();
    }
  }

  reconnect() {
    if (this.phisicallyCconnectedToEnd) {
      this._connectedTo = this.phisicallyConnectedTo;
      this._connectedToEnd = this.phisicallyCconnectedToEnd;
      if (this.phisicallyCconnectedToEnd.connectedTo !== this.endOf) {
        this.phisicallyCconnectedToEnd.connect(this);
      }
    }
  }
}
