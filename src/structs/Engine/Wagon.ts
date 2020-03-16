import { BaseBrick } from '../Base/BaseBrick';
import { WagonEnd } from './ActualWagon';
import { Ray } from '../Geometry/Ray';
import { Track } from '../Track/Track';
import { PositionOnTrack } from './PositionOnTrack';
import { WhichEnd } from '../Track/WhichEnd';

export interface Wagon extends BaseBrick {
  init(): Wagon;
  update(): void;
  getA(): WagonEnd;
  getB(): WagonEnd;
  getRay(): Ray;
  remove(): boolean;
  isRemoved(): boolean;
  putOnTrack(track: Track, position?: number, direction?: number): void;
  moveTowardsWagonB(distance: number): void;
  moveTowardsWagonA(distance: number): void;
  getLength(): number;
  getNearestWagon(end: WhichEnd): NearestWagon;
  swapEnds(): void;
  pullToPos(pot: PositionOnTrack, dir: number): void;
}

export interface NearestWagon {
  distance: number;
  wagon: Wagon;
  end: WagonEnd;
}
