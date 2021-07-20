import { Train } from './Train';
import { Signal } from '../Signaling/Signal';
import { BlockJoint } from '../Signaling/BlockJoint';
import { PositionOnTrack } from './PositionOnTrack';
import { Platform } from '../../structs/Interfaces/Platform';

export interface NearestData {
  distance: number;
  position?: PositionOnTrack;
  segmentCount: number;
  train?: Train;
  signal?: Signal;
  blockJoint?: BlockJoint;
  platform?: Platform;
}
