import { WhichEnd } from './WhichEnd';
import { TrackBase } from '../TrackBase/TrackBase';
import { TrackJoint } from '../TrackJoint/TrackJoint';

export class TrackEnd {
  protected whichEnd: WhichEnd;
  protected endOf: TrackBase;
  protected connectedEnd: TrackEnd;
  protected jointTo: TrackJoint;

  constructor(which: WhichEnd, endOf: TrackBase) {
    this.whichEnd = which;
    this.endOf = endOf;
  }

  connect(otherEnd: TrackEnd, joint?: TrackJoint) {
    if (this.connectedEnd) return;

    this.connectedEnd = otherEnd;
    if (joint) this.jointTo = joint;

    if (!otherEnd.isConnectedTo(this)) {
      otherEnd.connect(this, joint);
    }

    this.endOf.update();
  }

  isConnectedTo(otherEnd: TrackEnd) {
    return this.connectedEnd === otherEnd;
  }

  disconnect() {
    if (!this.connectedEnd) return;

    const temp = this.connectedEnd;
    this.connectedEnd = null;
    if (temp.isConnectedTo(this)) {
      temp.disconnect();
    }

    this.endOf.update();
  }

  remove() {
    this.disconnect();
    if (this.jointTo) {
      this.jointTo.removeEnd(this);
    }
    this.jointTo = null; // todo i'm not sure
  }

  update() {
    this.endOf.update();
  }

  getTrack(): TrackBase {
    return this.endOf;
  }

  getConnectedTrack(): TrackBase {
    if (this.hasConnectedTrack()) {
      return this.connectedEnd.getTrack();
    }
    return null;
  }

  hasConnectedTrack(): boolean {
    return this.isActive() && this.connectedEnd && this.connectedEnd.isActive();
  }

  getConnectedEnd(): TrackEnd {
    return this.connectedEnd;
  }

  getWhichEnd(): WhichEnd {
    return this.whichEnd;
  }

  getJointTo(): TrackJoint {
    return this.jointTo;
  }

  setJointTo(joint: TrackJoint): void {
    this.jointTo = joint;
  }

  getHash(): string {
    return this.whichEnd + this.endOf.getId();
  }

  isActive(): boolean {
    return true;
  }

  isSwitchingEnds(): boolean {
    if (!this.getConnectedEnd()) return null;
    return this.getWhichEnd() !== this.getConnectedEnd().getWhichEnd();
  }
}
