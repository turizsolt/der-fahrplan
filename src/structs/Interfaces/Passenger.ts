import { Platform } from './Platform';
import { BaseBrick } from './BaseBrick';
import { Coordinate } from '../Geometry/Coordinate';
import { Station } from '../Scheduling/Station';
import { Route } from '../Scheduling/Route';
import { Wagon } from './Wagon';
import { BaseBoardable } from './BaseBoardable';
import { Color } from '../Color';

export interface Passenger extends BaseBrick {
  init(from: Station, to: Station);
  getPlace(): BaseBoardable;
  getColor(): Color;
  getPosition(): Coordinate;
  listenStationAnnouncement(station: Station, trip: Route);
  listenStationArrivingAnnouncement(
    station: Station,
    platform: Platform,
    wagon: Wagon,
    trip: Route
  );
  listenWagonStoppedAtAnnouncement(
    station: Station,
    platform: Platform,
    wagon: Wagon,
    trip: Route
  );
  updatePos(pos: Coordinate): void;
}
