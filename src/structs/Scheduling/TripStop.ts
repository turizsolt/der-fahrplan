import { Platform } from '../Interfaces/Platform';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';

export interface TripStop {
  stationName: string;
  station: RailMapNode;
  stationRgbColor: string;
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
  isDepartureStation: boolean;
  isArrivalStation: boolean;
  shouldStop: boolean;
}

export interface OptionalTripStop {
  platform?: Platform;
  arrivalTime?: number;
  departureTime?: number;
  realArrivalTime?: number;
  realDepartureTime?: number;
}
