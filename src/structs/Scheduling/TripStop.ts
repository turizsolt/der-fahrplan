import { Station } from './Station';
import { Platform } from '../Interfaces/Platform';

export interface TripStop {
  stationName: string;
  station: Station;
  platform: Platform;
  platformNo: string;
  arrivalTime: number;
  departureTime: number;
  arrivalTimeString: string;
  departureTimeString: string;
  realArrivalTime: number;
  realDepartureTime: number;
  realArrivalTimeString: string;
  realDepartureTimeString: string;
  isServed: boolean;
  atStation: boolean;
}

export interface OptionalTripStop {
  platform?: Platform;
  arrivalTime?: number;
  departureTime?: number;
  realArrivalTime?: number;
  realDepartureTime?: number;
}
