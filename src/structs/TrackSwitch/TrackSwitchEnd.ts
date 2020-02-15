import { TrackSwitch } from './TrackSwitch';
import { TrackBase } from '../TrackBase/TrackBase';
import { TrackEnd } from '../Track/TrackEnd';
import { TrackJoint } from '../TrackJoint/TrackJoint';

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

  connect(other: TrackEnd, joint?: TrackJoint) {
    this.phisicallyConnectedTo = other.endOf;
    this._phisicallyConnectedToEnd = other;
    if (joint) this.jointTo = joint;

    if (this._active) {
      if (other.connectedTo !== this.endOf) {
        other.connect(this, joint);
      }
      this.reconnect();
    }
  }

  reconnect() {
    if (
      this.phisicallyCconnectedToEnd &&
      this.phisicallyCconnectedToEnd.isActive()
    ) {
      this._connectedTo = this.phisicallyConnectedTo;
      this._connectedToEnd = this.phisicallyCconnectedToEnd;
      if (this.phisicallyCconnectedToEnd.connectedTo !== this.endOf) {
        this.phisicallyCconnectedToEnd.connect(this);
      }
    }
  }

  isActive(): boolean {
    return this._active;
  }
}
