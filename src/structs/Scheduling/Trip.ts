import { Route } from './Route';
import { BaseStorable } from '../Interfaces/BaseStorable';

export interface Trip extends BaseStorable {
  init(route: Route, startTime: number): Trip;
}
