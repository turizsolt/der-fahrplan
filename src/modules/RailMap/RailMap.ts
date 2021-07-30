import { RailMapBounds } from "./RailMapBounds";
import { RailMapEdge } from "./RailMapEdge";
import { RailMapNode } from "./RailMapNode";

export interface RailMap {
    addNodes(nodes: RailMapNode[]): void;
    addEdge(nodeFrom: RailMapNode, nodeTo: RailMapNode, count?: number): void;
    getEdges(): Record<string, RailMapEdge>;
    getNodes(): RailMapNode[];
    setBounds(bounds: RailMapBounds): void;
    getBounds(): RailMapBounds;
}
