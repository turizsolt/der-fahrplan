import { Platform } from '../../structs/Interfaces/Platform';
import { TrackCurve } from './TrackCurve';
import { TrackEnd } from './TrackEnd';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { Wagon, NearestWagon } from '../../structs/Interfaces/Wagon';

export interface TrackBase extends BaseBrick {
  checkin(wagon: Wagon);
  checkout(wagon: Wagon);
  isEmpty(): boolean;
  getCheckedList(): Wagon[];
  getWagonClosest(
    from: number,
    to: number,
    excludeWagon: Wagon,
    ttl: number,
    initDist?: number
  ): NearestWagon;

  addPlatform(platform: Platform);
  getCurve(): TrackCurve;

  getPlatformsBeside();
  getA(): TrackEnd;
  getB(): TrackEnd;
  getId(): string;
  getLength(): number;

  remove(): boolean;
  isRemovable(): boolean;
  isRemoved(): boolean;
  update(): void;

  getEnd(e: string): TrackEnd;
}
