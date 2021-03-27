import { TrackJoint } from '../../modules/Track/TrackJoint/TrackJoint';
import { BaseRenderer } from './BaseRenderer';

export interface TrackJointRenderer extends BaseRenderer {
  init(trackackJoint: TrackJoint): void;
}
