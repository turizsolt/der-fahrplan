import { Platform } from '../../structs/Interfaces/Platform';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { TrackCurve } from './TrackCurve';
import { TrackDirection } from './TrackDirection';
import { DirectedTrack } from './DirectedTrack';
import { Train } from '../Train/Train';

export interface TrackBase extends BaseBrick {
  checkin(train: Train);
  checkout(wagon: Train);
  isEmpty(): boolean;
  getCheckedList(): Train[];

  addPlatform(platform: Platform);
  getPlatformsBeside();

  getCurve(): TrackCurve;
  getLength(): number;

  getDirected(direction: TrackDirection): DirectedTrack;

  update();
}
