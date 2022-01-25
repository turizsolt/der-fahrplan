import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { BaseStorable } from '../Interfaces/BaseStorable';
import { Station } from '../../modules/Station/Station';
import { RoutePart } from './RoutePart';
import { WhichEnd } from '../Interfaces/WhichEnd';
import { RouteVariant } from './RouteVariant';

export interface Route extends BaseStorable {
    init(): Route;
    remove(): void;

    getName(): string;
    setName(name: string): void;

    getColor(): string;
    setColor(color: string): void;

    addPart(whichEnd: WhichEnd, part: RoutePart): void;
    removePart(whichEnd: WhichEnd): void;
    getParts(whichEnd: WhichEnd): RoutePart[];
    getEnd(whichEnd: WhichEnd): RoutePart;

    getVariants(): RouteVariant[];

    hasCommonEdgeWith(route: Route): boolean;
    getEdges(): { from: RailMapNode; to: RailMapNode }[];
    getDetailedName(): string;

    // from the old version

    // hard part, a lot of rewrite will be needed - in 55 places to be exact
    // todo rewrite
    getStops(): RouteStop[];
    getWaypoints(): RouteStop[];
    addWaypoint(stop: RouteStop): void;
    removeStop(stop: RouteStop): void;

    // trip connector - to filter routes by its first and last station
    // todo RouteVariant
    getFirstStation(): Station;
    getLastStation(): Station;

    // nope
    // todo delete
    getFirstWaypoint(): RailMapNode;

    // diagram planner - add stop to plan the route from the last to the added
    // route planner - the same code - one of them is copy pasta
    // todo RouteVariant
    getLastWaypoint(): RailMapNode;

    // route planner - add stop
    // todo RouteVariant
    getLastStop(): RouteStop;
}
