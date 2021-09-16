import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { Trip } from './Trip';
import { Route } from './Route';
import { RouteStop } from './RouteStop';
import { AbstractPlatform } from '../../modules/Station/AbstractPlatform';

export interface TripStop {
    stationName: string;
    station: RailMapNode;
    stationRgbColor: string;
    platform: AbstractPlatform;
    platformNo: string;
    hasArrivalTime: boolean;
    hasDepartureTime: boolean;
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
    isStation: boolean;

    id: string;
    trip: Trip;
    route: Route;
    routeStop: RouteStop;
}

export interface OptionalTripStop {
    platform?: AbstractPlatform;
    arrivalTime?: number;
    departureTime?: number;
    realArrivalTime?: number;
    realDepartureTime?: number;
}
