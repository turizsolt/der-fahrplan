import { BaseStorable } from '../Interfaces/BaseStorable';
import { TripStop } from './TripStop';
import { Station } from '../../modules/Station/Station';
import { RoutePartReference } from './RoutePartReference';
import { RouteVariant } from './RouteVariant';
import { RoutePart } from './RoutePart';
import { AbstractPlatform } from '../../modules/Station/AbstractPlatform';

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
    getArrivalTime(): number;
    setDepartureTime(time: number): void;

    start(): void;
    arrive(ref: RoutePartReference): boolean;
    depart(): void;
    skip(ref: RoutePartReference): boolean;

    getWaypoints(): TripStop[];

    getStationDepartureTime(station: Station): number;
    getNextStation(): Station;
    updatePlatformInfo(routePart: RoutePart, platform: AbstractPlatform): void;
    isAtLastStation(): boolean;
    xpersistDeep(level: number): void;
}
