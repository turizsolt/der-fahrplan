import { TrackBase } from './TrackBase';
import { TrackJoint } from './TrackJoint/TrackJoint';
import { End } from '../../structs/Actuals/End';
import { WhichTrackEnd } from '../../structs/Interfaces/WhichTrackEnd';

export class TrackEnd extends End<TrackBase> {
  protected jointTo: TrackJoint;
  protected connectedEnd: TrackEnd;

  connect(otherEnd: TrackEnd, joint?: TrackJoint): boolean {
    if (this.connectedEnd) return false;

    this.connectedEnd = otherEnd;
    if (joint) this.jointTo = joint;

    if (!otherEnd.isConnectedTo(this)) {
      otherEnd.connect(this, joint);
    }

    this.endOf.update();
    return true;
  }

  getWhichTrackEnd(): WhichTrackEnd {
    return this.whichEnd;
  }

  hasConnectedEndOf(): boolean {
    return this.isActive() && this.connectedEnd && this.connectedEnd.isActive();
  }

  isActive(): boolean {
    return true;
  }

  getJointTo(): TrackJoint {
    return this.jointTo;
  }

  setJointTo(joint: TrackJoint): void {
    this.jointTo = joint;
  }

  persist(): Object {
    return {
      ...super.persist(),
      jointTo: this.jointTo.getId()
    };
  }
}
