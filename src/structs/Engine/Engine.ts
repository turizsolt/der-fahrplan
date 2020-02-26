import { Passenger } from '../Passenger/Passenger';
import { Track } from '../Track/Track';
import { TrackBase } from '../TrackBase/TrackBase';
import { Ray } from '../Geometry/Ray';

export interface Engine {
  putOnTrack(track: Track): void;
  forward(): void;
  backward(): void;
  stop(): void;
  getOn(passenger: Passenger): void;
  getOff(passenger: Passenger): void;
  getRay(): Ray;
  getTrackOn(): TrackBase;
}
