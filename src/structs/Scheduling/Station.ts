import { Circle } from '../Geometry/Circle';
import { Platform } from '../Interfaces/Platform';
import { Color } from '../Color';
import { Route } from './Route';
import { Wagon } from '../Interfaces/Wagon';
import { BaseBrick } from '../Interfaces/BaseBrick';
import { Boardable } from '../../mixins/Boardable';
import { Trip } from './Trip';

export interface Station extends BaseBrick, Boardable {
  init(circle: Circle): Station;
  initX(): Station;
  getName(): string;
  setName(name: string);
  getAnnouncedTrips(): Trip[];
  getPlatformTo(station: Station): Platform;
  getPlatforms(): Platform[];
  getCircle(): Circle;
  getColor(): Color;
  addPlatform(platform: Platform): void;
  removePlatform(platform: Platform): void;
  remove(): boolean;
  isRemoved(): boolean;

  announceArrived(wagon: Wagon, platform: Platform, trip: Route);
  announce(trip: Route);
  deannounce(trip: Route);
}
