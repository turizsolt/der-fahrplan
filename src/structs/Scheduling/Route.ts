import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { BaseStorable } from '../Interfaces/BaseStorable';
import { RouteStop } from './RouteStop';
import { Station } from '../../modules/Station/Station';
import { RoutePart } from './RoutePart';
import { WhichEnd } from '../Interfaces/WhichEnd';

export interface Route extends BaseStorable {
    init(): Route;
    remove(): void;

    getName(): string;
    setName(name: string): void;

    getColor(): string;
    setColor(color: string): void;

    addPart(whichEnd: WhichEnd, part: RoutePart): void;
    getParts(whichEnd: WhichEnd): RoutePart[];
    removePart(whichEnd: WhichEnd): void;

    // from the old version

    getStops(): RouteStop[];
    getWaypoints(): RouteStop[];
    addWaypoint(stop: RouteStop): void;
    removeStop(stop: RouteStop): void;

    getFirstStation(): Station;
    getLastStation(): Station;
    getFirstWaypoint(): RailMapNode;
    getLastWaypoint(): RailMapNode;
    getLastStop(): RouteStop;

    hasCommonEdgeWith(route: Route): boolean;
    getEdges(): { from: RailMapNode; to: RailMapNode }[];

    getDetailedName(): string;
}
