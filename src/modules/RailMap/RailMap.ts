import { RailMapBounds } from "./RailMapBounds";
import { RailMapEdge } from "./RailMapEdge";
import { RailMapNode } from "./RailMapNode";

export interface RailMap {
    addNodes(nodes: RailMapNode[]): void;
    addEdge(nodeFrom: RailMapNode, nodeTo: RailMapNode, count: number, distance: number): void;
    getEdges(): Record<string, RailMapEdge>;
    getNodes(): RailMapNode[];
    getNeighboursOf(node: RailMapNode): RailMapNode[];
    setBounds(bounds: RailMapBounds): void;
    getBounds(): RailMapBounds;
    getShortestPath(from: RailMapNode, to: RailMapNode): RailMapNode[];
    getDistance(from: RailMapNode, to: RailMapNode): number;
}
