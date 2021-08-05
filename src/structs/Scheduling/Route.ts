import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { BaseStorable } from '../Interfaces/BaseStorable';
import { RouteStop } from './RouteStop';
import { Station } from './Station';

export interface Route extends BaseStorable {
  init(): Route;
  getName(): string;
  getDetailedName(): string;
  setName(name: string): void;
  getStops(): RouteStop[];
  getWaypoints(): RouteStop[];
  addWaypoint(stop: RouteStop): void;
  removeStop(stop: RouteStop): void;
  remove(): void;
  setReverse(route: Route): void;
  getReverse(): Route;
  getColor(): string;
  setColor(color: string): void;
  getFirstStation(): Station;
  getLastStation(): Station;
  getFirstWaypoint(): RailMapNode;
  getLastWaypoint(): RailMapNode;
  getLastStop(): RouteStop;
  hasCommonEdgeWith(route: Route): boolean;
  getEdges(): { from: RailMapNode; to: RailMapNode }[];
}
