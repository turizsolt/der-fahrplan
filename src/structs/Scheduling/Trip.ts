import { BaseStorable } from '../Interfaces/BaseStorable';
import { TripStop, OptionalTripStop } from './TripStop';
import { Station } from '../../modules/Station/Station';
import { RoutePartReference } from './RoutePartReference';
import { RouteVariant } from './RouteVariant';
import { RoutePart } from './RoutePart';

export interface Trip extends BaseStorable {
    init(routeVariant: RouteVariant, startTime: number): Trip;

    getRouteVariant(): RouteVariant;

    getNextTrip(): Trip;
    setNextTrip(trip: Trip): void;

    getPrevTrip(): Trip;
    setPrevTrip(trip: Trip): void;

    getNextReverse(): boolean;
    toggleNextReverse(): void;

    getDepartureTime(): number;
    setDepartureTime(time: number): void;

    start(): void;
    arrive(ref: RoutePartReference): boolean;
    depart(): void;
    skip(ref: RoutePartReference): boolean;

    getWaypoints(): TripStop[];

    getStationDepartureTime(station: Station): number;
    getNextStation(): Station;
    updatePlatformInfo(routePart: RoutePart, props: OptionalTripStop): void;

    /*
    init(route: Route, startTime: number, hasGroup?: boolean): Trip;
    getRoute(): Route;
    getWaypoints(): TripStop[];
    redefine(stop: RouteStop, props: OptionalTripStop): void;
    undefine(stop: RouteStop, props: OptionalTripStop): void;
    setStationServed(station: Station): void;
    setAtStation(atStation: Station): void;
    setNextTrip(trip: Trip): void;
    getNextTrip(): Trip;
    getPrevTrip(): Trip;
    setPrevTrip(trip: Trip): void;
    xpersistDeep(level?: number): Object;
    setDepartureTime(time: number): void;
    getDepartureTime(): number;
    getDepartureTimeStr(): string;
    getArrivalTimeStr(): string;
    toggleNextReverse(): void;
    getNextReverse(): boolean;
    getHasGroup(): boolean;
    */
}
