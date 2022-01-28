import { Route } from "../../structs/Scheduling/Route";
import { RailMapBounds } from "./RailMapBounds";
import { RailMapEdge } from "./RailMapEdge";
import { RailMapNode } from "./RailMapNode";
import { RailMapRouteDraw, RailMapStop } from "./RailMapRoute";

export interface RailMap {
    addNodes(nodes: RailMapNode[]): void;
    addEdge(nodeFrom: RailMapNode, nodeTo: RailMapNode, count: number, distance: number): void;
    addRoute(route: Route): void;
    getEdges(): Record<string, RailMapEdge>;
    getNodes(): RailMapNode[];
    getRoutes(): RailMapRouteDraw[][];
    getStops(): RailMapStop[];
    getNeighboursOf(node: RailMapNode): RailMapNode[];
    setBounds(bounds: RailMapBounds): void;
    getBounds(): RailMapBounds;
    getShortestPath(from: RailMapNode, to: RailMapNode, forbiddenNodes: RailMapNode[]): RailMapNode[];
    getDistance(from: RailMapNode, to: RailMapNode): number;
    getTrackCount(from: RailMapNode, to: RailMapNode): number;
}
