import { Train } from '../Train/Train';
import { Signal } from '../Signaling/Signal';
import { BlockJoint } from '../Signaling/BlockJoint';

export interface TrackMarker {
  type: 'Train' | 'Signal' | 'BlockJoint';
  train?: Train;
  signal?: Signal;
  blockJoint?: BlockJoint;
}
