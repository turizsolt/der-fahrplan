import { BaseStorable } from '../Interfaces/BaseStorable';
import { Station } from './Station';
import { Platform } from '../Interfaces/Platform';

export interface TripStop extends BaseStorable {
  init(station: Station, platform?: Platform): TripStop;
  getStationName(): string;
}
