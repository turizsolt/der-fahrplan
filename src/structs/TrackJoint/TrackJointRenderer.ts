import { TrackJoint } from './TrackJoint';
import { BaseRenderer } from '../Base/BaseRenderer';

export interface TrackJointRenderer extends BaseRenderer {
  init(trackackJoint: TrackJoint): void;
}
