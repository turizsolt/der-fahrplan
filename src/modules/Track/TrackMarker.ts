import { Train } from '../Train/Train';
import { Signal } from '../Signaling/Signal';
import { BlockJoint } from '../Signaling/BlockJoint';
import { Sensor } from '../Signaling/Sensor';

export interface TrackMarker {
  type: 'Train' | 'Signal' | 'BlockJoint' | 'Sensor' | 'Nothing' | 'Nothing2';
  train?: Train;
  signal?: Signal;
  blockJoint?: BlockJoint;
  sensor?: Sensor;
}
