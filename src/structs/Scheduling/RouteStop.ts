import { BaseStorable } from '../Interfaces/BaseStorable';
import { Station } from './Station';
import { Platform } from '../Interfaces/Platform';

export interface RouteStop extends BaseStorable {
  init(
    station: Station,
    platform?: Platform,
    arrivalTime?: number,
    departureTime?: number
  ): RouteStop;
  getStationName(): string;
  getStation(): Station;
  getPlatform(): Platform;
  getArrivalTime(): number;
  getDepartureTime(): number;
}
