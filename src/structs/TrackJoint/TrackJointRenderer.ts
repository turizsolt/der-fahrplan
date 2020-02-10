import { TrackJoint } from './TrackJoint';

export interface TrackJointRenderer {
  init(trackackJoint: TrackJoint): void;
  update();
}
