import { TrackBase } from '../TrackBase/TrackBase';
import { WhichEnd } from './WhichEnd';
import { TrackJoint } from '../TrackJoint/TrackJoint';

export class TrackEnd {
  // readonly point: Coordinate;
  readonly endOf: TrackBase;
  protected which: WhichEnd;
  protected _connectedTo: TrackBase = null;
  protected jointTo: TrackJoint;
  get connectedTo() {
    return this._connectedTo;
  }
  protected _connectedToEnd: TrackEnd = null;
  get connectedToEnd() {
    return this._connectedToEnd;
  }

  constructor(which: WhichEnd, endOf: TrackBase) {
    this.which = which;
    this.endOf = endOf;
  }

  connect(other: TrackEnd, joint?: TrackJoint) {
    this._connectedTo = other.endOf;
    this._connectedToEnd = other;
    if (joint) this.jointTo = joint;
    if (other.connectedTo !== this.endOf) {
      other.connect(this, joint);
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

  getWhichEnd(): WhichEnd {
    return this.which;
  }

  getJointTo(): TrackJoint {
    return this.jointTo;
  }

  setJointTo(joint: TrackJoint): void {
    this.jointTo = joint;
  }

  getHash(): string {
    return this.which + this.endOf.getId();
  }
}
