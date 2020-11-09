import { BaseStorable } from '../Interfaces/BaseStorable';
import { Station } from './Station';
import { Platform } from '../Interfaces/Platform';

export interface RouteStop extends BaseStorable {
  init(station: Station, platform?: Platform): RouteStop;
  getStationName(): string;
  getStation(): Station;
  getPlatform(): Platform;
}
