import { Platform } from '../../structs/Interfaces/Platform';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { TrackCurve } from './TrackCurve';

export interface TrackBase extends BaseBrick {
  checkin(wagon: Wagon);
  checkout(wagon: Wagon);
  isEmpty(): boolean;
  getCheckedList(): Wagon[];

  addPlatform(platform: Platform);
  getPlatformsBeside();

  getCurve(): TrackCurve;
  getLength(): number;

  update();
}
