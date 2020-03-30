import { Circle } from '../Geometry/Circle';
import { Platform } from '../Interfaces/Platform';
import { Color } from '../Color';
import { Route } from './Route';
import { Wagon } from '../Interfaces/Wagon';
import { BaseBoardable } from '../Interfaces/BaseBoardable';

export interface Station extends BaseBoardable {
  init(circle: Circle): Station;
  getName(): string;
  setName(name: string);
  getPlatforms(): Platform[];
  getCircle(): Circle;
  getColor(): Color;
  addPlatform(platform: Platform): void;
  removePlatform(platform: Platform): void;
  remove(): boolean;
  isRemoved(): boolean;

  announceArrived(wagon: Wagon, platform: Platform, trip: Route);
  announce(trip: Route);
}
