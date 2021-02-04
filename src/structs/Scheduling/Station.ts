import { Circle } from '../Geometry/Circle';
import { Platform } from '../Interfaces/Platform';
import { Color } from '../Color';
import { Route } from './Route';
import { BaseBrick } from '../Interfaces/BaseBrick';
import { Train } from './Train';
import { Boardable } from '../../mixins/Boardable';
import { Trip } from './Trip';
import { TripInSchedule } from './TripInSchedule';
import { ShortestPath } from './ShortestPath';

export interface Station extends BaseBrick, Boardable {
  init(circle: Circle): Station;
  initX(): Station;
  getName(): string;
  setName(name: string);
  getAnnouncedTrips(): Route[];
  getPlatformTo(station: Station): Platform;
  getPlatforms(): Platform[];
  getCircle(): Circle;
  getColor(): Color;
  addPlatform(platform: Platform): void;
  removePlatform(platform: Platform): void;
  remove(): boolean;
  isRemoved(): boolean;

  announceArrived(train: Train, platform: Platform, trip: Trip);
  announce(trip: Route);
  deannounce(trip: Route);

  addTripToSchedule(trip: Trip);
  getScheduledTrips(): TripInSchedule[];
  getShortestPath(to: Station): ShortestPath;
}
