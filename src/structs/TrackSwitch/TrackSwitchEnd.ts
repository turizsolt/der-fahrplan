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

    this.endOf.update();
  }

  disconnect() {
    console.log('TTTdisco', this.getHash());
    if (this.connectedToEnd) {
      const temp = this.connectedToEnd;
      this._connectedTo = null;
      this._connectedToEnd = null;
      temp.disconnect();

      if (
        this.phisicallyCconnectedToEnd &&
        this.phisicallyCconnectedToEnd.removed
      ) {
        this.phisicallyConnectedTo = null;
        this._phisicallyConnectedToEnd = null;
      }
    }

    this.endOf.update();
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

    this.endOf.update();
  }

  isActive(): boolean {
    return this._active;
  }
}
