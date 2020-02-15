import { Engine } from '../Engine/Engine';
import { Platform } from '../Platform';
import { TrackSegment } from './TrackSegment';
import { TrackEnd } from '../Track/TrackEnd';

export interface TrackBase {
  checkin(engine: Engine);
  checkout(engine: Engine);
  addPlatform(platform: Platform);
  getSegment(): TrackSegment;

  getPlatformsBeside();
  getA(): TrackEnd;
  getB(): TrackEnd;
  getId(): string;

  remove(): void;
  isRemoved(): boolean;
}
