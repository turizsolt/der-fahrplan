import { Route } from './Route';
import { BaseStorable } from '../Interfaces/BaseStorable';
import { TripStop, OptionalTripStop } from './TripStop';
import { RouteStop } from './RouteStop';
import { Station } from '../../modules/Station/Station';

export interface Trip extends BaseStorable {
    init(route: Route, startTime: number, hasGroup?: boolean): Trip;
    getRoute(): Route;
    getWaypoints(): TripStop[];
    redefine(stop: RouteStop, props: OptionalTripStop): void;
    undefine(stop: RouteStop, props: OptionalTripStop): void;
    getStationDepartureTime(station: Station): number;
    getStationFollowingStops(station: Station): TripStop[];
    setStationServed(station: Station): void;
    setAtStation(atStation: Station): void;
    getRemainingStops(): TripStop[];
    isStillInFuture(station: Station): boolean;
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
    getNextStation(): Station;
}
