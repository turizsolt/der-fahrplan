import { Station } from './Station';
import { Platform } from '../Interfaces/Platform';

export interface TripStop {
  stationName: string;
  station: Station;
  platform: Platform;
  arrivalTime: number;
  departureTime: number;
}

export interface OptionalTripStop {
  platform?: Platform;
  arrivalTime?: number;
  departureTime?: number;
}
