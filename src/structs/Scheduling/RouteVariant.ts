import { RoutePart } from './RoutePart';
import { WhichEnd } from '../Interfaces/WhichEnd';

export interface RouteVariant {
    setStartEnd(whichEnd: WhichEnd): void;
    getStartEnd(): WhichEnd;

    getFirstStop(): RoutePart;
    getLastStop(): RoutePart;
    getStops(): RoutePart[];
    getWaypoints(): RoutePart[];
}
