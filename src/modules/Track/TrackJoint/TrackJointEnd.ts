import { TrackJoint } from './TrackJoint';
import { WhichEnd } from '../../../structs/Interfaces/WhichEnd';

export interface TrackJointEnd {
  joint: TrackJoint;
  end: WhichEnd;
}
