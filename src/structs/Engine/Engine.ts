import { Passenger } from '../Passenger/Passenger';
import { Track } from '../Track/Track';
import { Coordinate } from '../Geometry/Coordinate';

export interface Engine {
  putOnTrack(track: Track);
  forward();
  backward();
  stop();
  resume();
  getOn(passenger: Passenger);
  getOff(passenger: Passenger);
  getPosition(): Coordinate;
  getRotation(): number;
}
