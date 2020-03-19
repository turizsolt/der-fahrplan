import { TrackJoint } from '../Interfaces/TrackJoint';
import { BaseRenderer } from './BaseRenderer';

export interface TrackJointRenderer extends BaseRenderer {
  init(trackackJoint: TrackJoint): void;
}
