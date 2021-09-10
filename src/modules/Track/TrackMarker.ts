import { Train } from '../Train/Train';
import { Signal } from '../Signaling/Signal';
import { BlockJoint } from '../Signaling/BlockJoint';
import { Sensor } from '../Signaling/Sensor';
import { Platform } from '../../structs/Interfaces/Platform';

export interface TrackMarker {
  type:
  | 'Train'
  | 'Signal'
  | 'BlockJoint'
  | 'Sensor'
  | 'Platform'
  | 'Nothing'
  | 'Nothing2'
  | 'End';
  train?: Train;
  signal?: Signal;
  blockJoint?: BlockJoint;
  sensor?: Sensor;
  platform?: Platform;
}
