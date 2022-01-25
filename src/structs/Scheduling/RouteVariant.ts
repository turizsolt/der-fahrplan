import { RoutePart } from './RoutePart';
import { WhichEnd } from '../Interfaces/WhichEnd';
import { BaseStorable } from '../Interfaces/BaseStorable';
import { Route } from './Route';

export interface RouteVariant extends BaseStorable {
    init(route: Route, startEnd: WhichEnd): RouteVariant;

    getRoute(): Route;

    setStartEnd(whichEnd: WhichEnd): void;
    getStartEnd(): WhichEnd;

    getColor(): string;
    getName(): string;

    getFirstStop(): RoutePart;
    getLastStop(): RoutePart;
    getStops(): RoutePart[];
    getWaypoints(): RoutePart[];

    hasCommonEdgeWith(routeVariant: RouteVariant): boolean;
}
