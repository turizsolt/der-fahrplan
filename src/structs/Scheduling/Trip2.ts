import { BaseStorable } from '../Interfaces/BaseStorable';
import { RoutePartReference } from './RoutePartReference';
import { RouteVariant } from './RouteVariant';
import { TripStop } from './TripStop';

export interface Trip2 extends BaseStorable {
    init(routeVariant: RouteVariant, startTime: number): Trip2;

    getNextTrip(): Trip2;
    setNextTrip(trip: Trip2): void;

    getPrevTrip(): Trip2;
    setPrevTrip(trip: Trip2): void;

    getNextReverse(): boolean;
    toggleNextReverse(): void;

    getDepartureTime(): number;
    setDepartureTime(time: number): void;

    start(): void;
    arrive(ref: RoutePartReference): boolean;
    depart(): void;
    skip(ref: RoutePartReference): boolean;

    getWaypoints(): TripStop[];
}
