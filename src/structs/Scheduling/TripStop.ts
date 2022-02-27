import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { Trip } from './Trip';
import { Route } from './Route';
import { AbstractPlatform } from '../../modules/Station/AbstractPlatform';
import { RouteVariant } from './RouteVariant';
import { RoutePart } from './RoutePart';

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
    realArrivalTime: number;
    realDepartureTime: number;
    duration: number;
    isServed: boolean;
    atStation: boolean;
    isDepartureStation: boolean;
    isArrivalStation: boolean;
    shouldStop: boolean;
    isStation: boolean;
    isReverseStop: boolean;

    id: string;
    trip: Trip;
    route: Route;
    routeVariant: RouteVariant;
    routePart: RoutePart;
    routePartNo: number;
}

export interface OptionalTripStop {
    platform?: AbstractPlatform;
    arrivalTime?: number;
    departureTime?: number;
    realArrivalTime?: number;
    realDepartureTime?: number;
    duration?: number;
}
