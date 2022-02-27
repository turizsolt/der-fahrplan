import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { BaseStorable } from '../Interfaces/BaseStorable';
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
}
