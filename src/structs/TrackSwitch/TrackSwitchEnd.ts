import { TrackSwitch } from './TrackSwitch';
import { TrackBase } from '../TrackBase/TrackBase';
import { TrackEnd } from '../Track/TrackEnd';
import { Coordinate } from '../Geometry/Coordinate';

export class TrackSwitchEnd extends TrackEnd {
  readonly point: Coordinate;
  readonly endOf: TrackSwitch;
  private phisicallyConnectedTo: TrackBase;
  private _phisicallyConnectedToEnd: TrackEnd;
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
    if (other.connectedTo !== this.endOf) {
      // todo: nem lesz ebből végtelen ciklus, ha két váltót összekötök?
      other.connect(this);
    }

    if (this._active) {
      this.reconnect();
    }
  }

  reconnect() {
    this._connectedTo = this.phisicallyConnectedTo;
    this._connectedToEnd = this.phisicallyCconnectedToEnd;
    if (this.phisicallyCconnectedToEnd.connectedTo !== this.endOf) {
      this.phisicallyCconnectedToEnd.connect(this);
    }
  }
}
