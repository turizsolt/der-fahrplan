import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Store } from '../Actuals/Store/Store';
import { BaseStorable } from '../Interfaces/BaseStorable';
import { RouteStop } from './RouteStop';

export interface Route extends BaseStorable {
  init(): Route;
  getName(): string;
  setName(name: string): void;
  getStops(): any[];
  addStop(stop: RouteStop): void;
  removeStop(stop: RouteStop): void;
  swapStopWithPrev(stop: RouteStop): void;
}
