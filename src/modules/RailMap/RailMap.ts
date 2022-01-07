import { Route } from "../../structs/Scheduling/Route";
import { RailMapBounds } from "./RailMapBounds";
import { RailMapEdge } from "./RailMapEdge";
import { RailMapNode } from "./RailMapNode";
import { RailMapRoute } from "./RailMapRoute";

export interface RailMap {
    addNodes(nodes: RailMapNode[]): void;
    addEdge(nodeFrom: RailMapNode, nodeTo: RailMapNode, count: number, distance: number): void;
    addRoute(route: Route): void;
    getEdges(): Record<string, RailMapEdge>;
    getNodes(): RailMapNode[];
    getRoutes(): RailMapRoute[];
    getNeighboursOf(node: RailMapNode): RailMapNode[];
    setBounds(bounds: RailMapBounds): void;
    getBounds(): RailMapBounds;
    getShortestPath(from: RailMapNode, to: RailMapNode): RailMapNode[];
    getDistance(from: RailMapNode, to: RailMapNode): number;
    getTrackCount(from: RailMapNode, to: RailMapNode): number;
}
