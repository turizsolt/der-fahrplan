import { RailMap } from "./RailMap";
import { RailMapEdge } from "./RailMapEdge";
import { RailMapNode } from "./RailMapNode";

export class ActualRailMap implements RailMap {
    private nodes: RailMapNode[] = [];
    private edges: Record<string, RailMapEdge> = {};

    addNodes(nodes: RailMapNode[]): void {
        this.nodes.push(...nodes);
    }

    addEdge(nodeFrom: RailMapNode, nodeTo: RailMapNode, count: number = 1): void {
        let { from, to } = this.orderNodes(nodeFrom, nodeTo);
        const hash = this.hashNodes(from, to);
        if (!this.edges[hash]) {
            this.edges[hash] = { from, to, count: 0 };
        }
        this.edges[hash].count += count;
    }

    getEdges(): Record<string, RailMapEdge> {
        return this.edges;
    }

    private orderNodes(from: RailMapNode, to: RailMapNode): { from: RailMapNode, to: RailMapNode } {
        return from.getId() < to.getId() ? { from, to } : { from: to, to: from };
    }

    private hashNodes(from: RailMapNode, to: RailMapNode): string {
        return from.getId() + '-' + to.getId();
    }
}
