import { RailMap } from "./RailMap";
import { RailMapBounds } from "./RailMapBounds";
import { RailMapEdge } from "./RailMapEdge";
import { RailMapNode } from "./RailMapNode";

export class ActualRailMap implements RailMap {
    private nodes: RailMapNode[] = [];
    private edges: Record<string, RailMapEdge> = {};
    private bounds: RailMapBounds;
    private neighbours: Record<string, RailMapNode[]> = {};

    addNodes(nodes: RailMapNode[]): void {
        this.nodes.push(...nodes);
        for (let node of nodes) {
            this.neighbours[node.getId()] = [];
        }
    }

    addEdge(nodeFrom: RailMapNode, nodeTo: RailMapNode, count: number = 1): void {
        let { from, to } = this.orderNodes(nodeFrom, nodeTo);
        const hash = this.hashNodes(from, to);
        if (!this.edges[hash]) {
            this.edges[hash] = { from, to, count: 0 };
            this.neighbours[nodeFrom.getId()].push(nodeTo);
            this.neighbours[nodeTo.getId()].push(nodeFrom);
        }
        this.edges[hash].count += count;
    }

    getEdges(): Record<string, RailMapEdge> {
        return this.edges;
    }

    getNodes(): RailMapNode[] {
        return this.nodes;
    }

    getNeighboursOf(node: RailMapNode): RailMapNode[] {
        return this.neighbours[node.getId()];
    }

    setBounds(bounds: RailMapBounds): void {
        this.bounds = bounds;
    }

    getBounds(): RailMapBounds {
        return this.bounds
    }

    getShortestPath(from: RailMapNode, to: RailMapNode): RailMapNode[] {
        const queue: RailMapNode[] = [from];
        const comesFrom: Record<string, RailMapNode> = { [from.getId()]: null };

        while (queue.length > 0) {
            const next = queue.shift();

            if (next === to) {
                const result: RailMapNode[] = [];
                let x = to;
                result.push(x);
                x = comesFrom[x.getId()];
                while (x) {
                    result.push(x);
                    x = comesFrom[x.getId()];
                }

                return result.reverse();
            }

            for (let e of this.getNeighboursOf(next)) {
                if (comesFrom[e.getId()] === undefined) {
                    comesFrom[e.getId()] = next;
                    queue.push(e);
                }
            }
        }

        return undefined;
    }

    private orderNodes(from: RailMapNode, to: RailMapNode): { from: RailMapNode, to: RailMapNode } {
        return from.getId() < to.getId() ? { from, to } : { from: to, to: from };
    }

    private hashNodes(from: RailMapNode, to: RailMapNode): string {
        return from.getId() + '-' + to.getId();
    }
}
