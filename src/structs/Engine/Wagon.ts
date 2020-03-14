import { BaseBrick } from '../Base/BaseBrick';
import { WagonEnd } from './ActualWagon';
import { Ray } from '../Geometry/Ray';
import { Track } from '../Track/Track';

export interface Wagon extends BaseBrick {
  init(): Wagon;
  update(): void;
  getA(): WagonEnd;
  getB(): WagonEnd;
  getRay(): Ray;
  remove(): boolean;
  isRemoved(): boolean;
  putOnTrack(track: Track, position?: number, direction?: number): void;
  forward(distance: number): void;
  backward(distance: number): void;
}
