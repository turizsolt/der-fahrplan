import { Route } from './Route';
import { BaseStorable } from '../Interfaces/BaseStorable';
import { TripStop, OptionalTripStop } from './TripStop';
import { RouteStop } from './RouteStop';
import { Station } from './Station';

export interface Trip extends BaseStorable {
  init(route: Route, startTime: number): Trip;
  getRoute(): Route;
  getStops(): TripStop[];
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
  setPrevTrip(trip: Trip): void;
  xpersistDeep(level?: number): Object;
  getDepartureTime(): number;
  toggleNextReverse(): void;
  getNextReverse(): boolean;
}
