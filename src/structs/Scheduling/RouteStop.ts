import { BaseStorable } from '../Interfaces/BaseStorable';
import { Station } from '../../modules/Station/Station';
import { Platform } from '../../modules/Station/Platform';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';

export interface RouteStop extends BaseStorable {
    init(
        waypoint: RailMapNode,
        platform?: Platform,
        arrivalTime?: number,
        departureTime?: number
    ): RouteStop;
    getStation(): Station;
    getWaypoint(): RailMapNode;
    getWaypointName(): string;
    getPlatform(): Platform;

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
