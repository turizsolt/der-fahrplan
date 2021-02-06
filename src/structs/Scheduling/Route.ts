import { BaseStorable } from '../Interfaces/BaseStorable';
import { RouteStop } from './RouteStop';

export interface Route extends BaseStorable {
  init(): Route;
  getName(): string;
  getDetailedName(): string;
  setName(name: string): void;
  getStops(): RouteStop[];
  addStop(stop: RouteStop): void;
  removeStop(stop: RouteStop): void;
  swapStopWithPrev(stop: RouteStop): void;
  remove(): void;
  setReverse(route: Route): void;
  getReverse(): Route;
  getColor(): string;
  setColor(color: string): void;
}
