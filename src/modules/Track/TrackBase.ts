import { Platform } from '../../structs/Interfaces/Platform';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { TrackCurve } from './TrackCurve';
import { TrackDirection } from './TrackDirection';
import { DirectedTrack } from './DirectedTrack';

export interface TrackBase extends BaseBrick {
  checkin(wagon: Wagon);
  checkout(wagon: Wagon);
  isEmpty(): boolean;
  getCheckedList(): Wagon[];

  addPlatform(platform: Platform);
  getPlatformsBeside();

  getCurve(): TrackCurve;
  getLength(): number;

  getDirected(direction: TrackDirection): DirectedTrack;

  update();
}
