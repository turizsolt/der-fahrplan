import { BaseStorable } from '../Interfaces/BaseStorable';
import { Station } from '../../modules/Station/Station';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { AbstractPlatform } from '../../modules/Station/AbstractPlatform';

export interface RouteStop extends BaseStorable {
    init(
        waypoint: RailMapNode,
        platform?: AbstractPlatform,
        arrivalTime?: number,
        departureTime?: number
    ): RouteStop;
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
