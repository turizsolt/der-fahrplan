import { Passenger } from '../Actuals/Passenger';
import { Track } from './Track';
import { TrackBase } from './TrackBase';
import { Ray } from '../Geometry/Ray';
import { Coordinate } from '../Geometry/Coordinate';
import { BaseBrick } from './BaseBrick';

export interface Engine extends BaseBrick {
  init(): Engine;
  putOnTrack(track: Track, position?: number, direction?: number): void;
  forward(): void;
  backward(): void;
  stop(): void;
  getOn(passenger: Passenger): void;
  getOff(passenger: Passenger): void;
  getPosition(): Coordinate;
  getRay(): Ray;
  getTrackOn(): TrackBase;
  remove(): boolean;
  isRemoved(): boolean;
}
