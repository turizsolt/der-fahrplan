import { RoutePart } from './RoutePart';
import { WhichEnd } from '../Interfaces/WhichEnd';
import { BaseStorable } from '../Interfaces/BaseStorable';
import { Route } from './Route';
import { Emitable } from '../../mixins/Emitable';
import { TimeOrHeadway } from './TimeOrHeadway';

export interface RouteVariant extends BaseStorable, Emitable {
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

    updateTimeCode(timesOrHeadways: TimeOrHeadway[]): void;
    getTimesOrHeadways(): TimeOrHeadway[];
}
