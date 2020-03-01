import { Engine } from '../Engine/Engine';
import { Platform } from '../Platform/Platform';
import { TrackSegment } from './TrackSegment';
import { TrackEnd } from '../Track/TrackEnd';
import { BaseBrick } from '../Base/BaseBrick';

export interface TrackBase extends BaseBrick {
  checkin(engine: Engine);
  checkout(engine: Engine);
  addPlatform(platform: Platform);
  getSegment(): TrackSegment;

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
