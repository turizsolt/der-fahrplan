import { WagonEnd } from '../Actuals/Wagon/WagonEnd';
import { Ray } from '../Geometry/Ray';
import { Track } from './Track';
import { PositionOnTrack } from '../Actuals/Track/PositionOnTrack';
import { WhichEnd } from '../Interfaces/WhichEnd';
import { Route } from '../Scheduling/Route';
import { Platform } from './Platform';
import { BaseBoardable } from './BaseBoardable';

export interface Wagon extends BaseBoardable {
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
  stop(): void;

  getLength(): number;
  getNearestWagon(end: WhichEnd): NearestWagon;
  swapEnds(): void;
  pullToPos(pot: PositionOnTrack, dir: number): void;

  assignTrip(route: Route): void;
  getTrip(): Route;

  stoppedAt(platform: Platform): void;

  subscribeToUpdates(callback: (wagon: Object) => void): void;
  unsubscribeToUpdates(callback: (wagon: Object) => void): void;
}

export interface NearestWagon {
  distance: number;
  wagon: Wagon;
  end: WagonEnd;
}
