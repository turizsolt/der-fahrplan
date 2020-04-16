import { Platform } from './Platform';
import { BaseBrick } from './BaseBrick';
import { Coordinate } from '../Geometry/Coordinate';
import { Station } from '../Scheduling/Station';
import { Route } from '../Scheduling/Route';
import { Color } from '../Color';
import { Boardable } from '../../mixins/Boardable';
import { Train } from '../Scheduling/Train';

export type Place = Boardable & BaseBrick;

export interface Passenger extends BaseBrick {
  init(from: Station, to: Station);
  getPlace(): Place;
  getColor(): Color;
  getPosition(): Coordinate;
  listenStationAnnouncement(station: Station);
  listenStationArrivingAnnouncement(
    station: Station,
    platform: Platform,
    train: Train,
    trip: Route
  );
  listenWagonStoppedAtAnnouncement(
    station: Station,
    platform: Platform,
    train: Train,
    trip: Route
  );
  updatePos(pos: Coordinate): void;
}
