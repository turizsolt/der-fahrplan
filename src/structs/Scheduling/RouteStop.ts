import { BaseStorable } from '../Interfaces/BaseStorable';
import { Station } from '../../modules/Station/Station';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { AbstractPlatform } from '../../modules/Station/AbstractPlatform';
import { Route } from './Route';

export interface RouteStop extends BaseStorable {
    init(
        waypoint: RailMapNode,
        platform?: AbstractPlatform,
        route?: Route,
        arrivalTime?: number,
        departureTime?: number
    ): RouteStop;

    setRoute(route: Route): void;

    getExtraTimeToStation(): number;
    getExtraTimeAtStation(): number;
    setExtraTimeToStation(time: number): void;
    setExtraTimeAtStation(time: number): void;
    getTimeToStation(): number;
    getTimeAtStation(): number;

    getStation(): Station;
    getWaypoint(): RailMapNode;
    getWaypointName(): string;
    getPlatform(): AbstractPlatform;
    setPlatform(platform: AbstractPlatform): void;

    hasArrivalTime(): boolean;
    hasDepartureTime(): boolean;
    getArrivalTime(): number;
    getDepartureTime(): number;
    setArrivalTime(time: number): void;
    setDepartureTime(time: number): void;

    toggleReverseStop(): void;
    isReverseStop(): boolean;

    setShouldStop(shouldStop: boolean): void;
    getShouldStop(): boolean;
    isStation(): boolean;
}
