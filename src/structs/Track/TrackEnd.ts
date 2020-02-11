import { TrackBase } from '../TrackBase/TrackBase';
import { Coordinate } from '../Coordinate';

export class TrackEnd {
  readonly point: Coordinate;
  readonly endOf: TrackBase;
  protected _connectedTo: TrackBase;
  get connectedTo() {
    return this._connectedTo;
  }
  protected _connectedToEnd: TrackEnd;
  get connectedToEnd() {
    return this._connectedToEnd;
  }

  constructor(point: Coordinate, endOf: TrackBase) {
    this.point = point;
    this.endOf = endOf;
  }

  connect(other: TrackEnd) {
    this._connectedTo = other.endOf;
    this._connectedToEnd = other;
    if (other.connectedTo !== this.endOf) {
      other.connect(this);
    }
  }

  disconnect() {
    if (this.connectedToEnd) {
      const temp = this.connectedToEnd;
      this._connectedTo = null;
      this._connectedToEnd = null;
      temp.disconnect();
    }
  }
}
