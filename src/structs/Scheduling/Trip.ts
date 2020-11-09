import { Route } from './Route';
import { BaseStorable } from '../Interfaces/BaseStorable';
import { TripStop, OptionalTripStop } from './TripStop';
import { RouteStop } from './RouteStop';

export interface Trip extends BaseStorable {
  init(route: Route, startTime: number): Trip;
  getRoute(): Route;
  getStops(): TripStop[];
  redefine(stop: RouteStop, props: OptionalTripStop): void;
}
