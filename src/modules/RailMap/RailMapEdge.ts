import { RailMapNode } from "./RailMapNode";

export interface RailMapEdge {
    from: RailMapNode;
    to: RailMapNode;
    count: number;
    avgDistance: number;
    distances: number[];
    routeCount: number;
}
