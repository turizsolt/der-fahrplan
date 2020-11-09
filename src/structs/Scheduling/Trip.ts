import { Route } from './Route';
import { BaseStorable } from '../Interfaces/BaseStorable';
import { TripStop } from './TripStop';

export interface Trip extends BaseStorable {
  init(route: Route, startTime: number): Trip;
  getRoute(): Route;
  getStops(): TripStop[];
}
