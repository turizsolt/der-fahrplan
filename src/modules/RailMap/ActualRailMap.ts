import { Coordinate } from "../../structs/Geometry/Coordinate";
import { Ray } from "../../structs/Geometry/Ray";
import { Route } from "../../structs/Scheduling/Route";
import { RailMap } from "./RailMap";
import { RailMapBounds } from "./RailMapBounds";
import { RailMapEdge } from "./RailMapEdge";
import { RailMapNode } from "./RailMapNode";
import { RailMapRoute } from "./RailMapRoute";

export class ActualRailMap implements RailMap {
    private nodes: RailMapNode[] = [];
    private edges: Record<string, RailMapEdge> = {};
    private bounds: RailMapBounds;
    private neighbours: Record<string, RailMapNode[]> = {};
    private routes: RailMapRoute[] = [];

    addNodes(nodes: RailMapNode[]): void {
        this.nodes.push(...nodes);
        for (let node of nodes) {
            this.neighbours[node.getId()] = [];
        }
    }

    addEdge(nodeFrom: RailMapNode, nodeTo: RailMapNode, count: number, distance: number): void {
        let { from, to } = this.orderNodes(nodeFrom, nodeTo);
        const hash = this.hashNodes(from, to);
        if (!this.edges[hash]) {
            this.edges[hash] = { from, to, count: 0, avgDistance: 0, distances: [], routeCount: 0 };
            this.neighbours[nodeFrom.getId()].push(nodeTo);
            this.neighbours[nodeTo.getId()].push(nodeFrom);
        }
        this.edges[hash].count += count;
        this.edges[hash].distances.push(distance);
        this.edges[hash].avgDistance = sum(this.edges[hash].distances) / this.edges[hash].count;
    }

    addRoute(route: Route): void {
        const mapRoute: RailMapRoute = [];
        const waypoints = route.getVariants()[0].getWaypoints();
        for (let i = 1; i < waypoints.length; i++) {
            const { from, to } = this.orderNodes(waypoints[i - 1].getRef() as RailMapNode, waypoints[i].getRef() as RailMapNode);
            const hash = this.hashNodes(from, to);
            const routeCount = this.edges[hash].routeCount++;

            const fromCoord: Coordinate = from.getCoord();
            const toCoord: Coordinate = to.getCoord();
            const fromDir: number = fromCoord.whichDir2d(toCoord);
            const toDir: number = toCoord.whichDir2d(fromCoord);

            mapRoute.push({
                from: new Ray(fromCoord, fromDir),
                to: new Ray(toCoord, toDir),
                no: routeCount,
                color: route.getColor(),
                routeId: route.getId()
            });
        }
        this.routes.push(mapRoute);
    }

    getEdges(): Record<string, RailMapEdge> {
        return this.edges;
    }

    getNodes(): RailMapNode[] {
        return this.nodes;
    }

    getRoutes(): RailMapRoute[] {
        return this.routes;
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

    getDistance(nodeFrom: RailMapNode, nodeTo: RailMapNode): number {
        let { from, to } = this.orderNodes(nodeFrom, nodeTo);
        const hash = this.hashNodes(from, to);

        return this.edges[hash]?.avgDistance;
    }

    getTrackCount(nodeFrom: RailMapNode, nodeTo: RailMapNode): number {
        let { from, to } = this.orderNodes(nodeFrom, nodeTo);
        const hash = this.hashNodes(from, to);

        return this.edges[hash]?.count;
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

function sum(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0);
}