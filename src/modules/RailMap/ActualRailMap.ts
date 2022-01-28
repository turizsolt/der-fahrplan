import { Coordinate } from "../../structs/Geometry/Coordinate";
import { Ray } from "../../structs/Geometry/Ray";
import { Route } from "../../structs/Scheduling/Route";
import { RailMap } from "./RailMap";
import { RailMapBounds } from "./RailMapBounds";
import { RailMapEdge } from "./RailMapEdge";
import { RailMapNode } from "./RailMapNode";
import { RailMapRoute, RailMapRouteArray, RailMapRouteDraw } from "./RailMapRoute";

const DEFAULT_ROUTE_GAP = 6;
const DEFAULT_STATION_GAP = 3;

export class ActualRailMap implements RailMap {
    private nodes: RailMapNode[] = [];
    private edges: Record<string, RailMapEdge> = {};
    private bounds: RailMapBounds;
    private neighbours: Record<string, RailMapNode[]> = {};
    private routes: RailMapRouteArray[] = [];
    private routesDraw: RailMapRouteDraw[][] = [];
    private nodesWithHash: Record<string, Record<string, any[]>> = {};
    private nodesWithRoute: Record<string, Record<string, any[]>> = {};

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
            this.edges[hash] = { from, to, count: 0, avgDistance: 0, distances: [], routeCount: 0, opposite: from === nodeTo };
            this.neighbours[nodeFrom.getId()].push(nodeTo);
            this.neighbours[nodeTo.getId()].push(nodeFrom);
        }
        this.edges[hash].count += count;
        this.edges[hash].distances.push(distance);
        this.edges[hash].avgDistance = sum(this.edges[hash].distances) / this.edges[hash].count;
    }

    addRoute(route: Route): void {
        const mapRoute: RailMapRouteArray = [];
        const waypoints = route.getVariants()[0].getWaypoints();
        for (let i = 1; i < waypoints.length; i++) {
            const { from, to } = this.orderNodes(waypoints[i - 1].getRef() as RailMapNode, waypoints[i].getRef() as RailMapNode);
            const hash = this.hashNodes(from, to);
            const routeCount = this.edges[hash].routeCount++;

            const fromCoord: Coordinate = from.getCoord();
            const toCoord: Coordinate = to.getCoord();
            const fromDir: number = fromCoord.whichDir2d(toCoord);
            const toDir: number = toCoord.whichDir2d(fromCoord);

            const routeProps: RailMapRoute = {
                from: new Ray(fromCoord, fromDir),
                to: new Ray(toCoord, toDir),
                fromOriginal: new Ray(fromCoord, fromDir),
                toOriginal: new Ray(toCoord, toDir),
                fromId: from.getId(),
                toId: to.getId(),
                no: routeCount,
                color: route.getColor(),
                routeId: route.getId(),
                hash,
                count: 1,
                opposite: this.edges[hash].opposite
            };

            mapRoute.push(routeProps);

            if (!this.nodesWithHash[from.getId()]) {
                this.nodesWithHash[from.getId()] = {};
            }
            if (!this.nodesWithHash[from.getId()][to.getId()]) {
                this.nodesWithHash[from.getId()][to.getId()] = [];
            }

            if (!this.nodesWithHash[to.getId()]) {
                this.nodesWithHash[to.getId()] = {};
            }
            if (!this.nodesWithHash[to.getId()][from.getId()]) {
                this.nodesWithHash[to.getId()][from.getId()] = [];
            }

            this.nodesWithHash[from.getId()][to.getId()].push({ which: 'from', routeProps });
            this.nodesWithHash[to.getId()][from.getId()].push({ which: 'to', routeProps });

            if (!this.nodesWithRoute[from.getId()]) {
                this.nodesWithRoute[from.getId()] = {};
            }
            if (!this.nodesWithRoute[from.getId()][route.getId()]) {
                this.nodesWithRoute[from.getId()][route.getId()] = [];
            }

            if (!this.nodesWithRoute[to.getId()]) {
                this.nodesWithRoute[to.getId()] = {};
            }
            if (!this.nodesWithRoute[to.getId()][route.getId()]) {
                this.nodesWithRoute[to.getId()][route.getId()] = [];
            }

            this.nodesWithRoute[from.getId()][route.getId()].push({ which: 'from', routeProps });
            this.nodesWithRoute[to.getId()][route.getId()].push({ which: 'to', routeProps });
        }
        this.routes.push(mapRoute);

        // b

        for (let route of this.routes) {
            for (let edge of route) {
                edge.count = this.edges[edge.hash].routeCount;
                const no = (- ((edge.count - 1) / 2) + edge.no) * (edge.opposite ? -1 : 1);
                edge.from = edge.fromOriginal.fromHere(0, edge.count * DEFAULT_STATION_GAP).fromHere(Math.PI / 2, DEFAULT_ROUTE_GAP * no);
                edge.to = edge.toOriginal.fromHere(0, edge.count * DEFAULT_STATION_GAP).fromHere(-Math.PI / 2, DEFAULT_ROUTE_GAP * no);
            }
        }

        // c
        this.routesDraw = [];
        for (let key of Object.keys(this.nodesWithRoute)) {
            for (let key2 of Object.keys(this.nodesWithRoute[key])) {
                const arr = this.nodesWithRoute[key][key2];

                // console.log(arr.length);
                if (arr.length === 2) {
                    const a0: Ray = arr[0].routeProps[arr[0].which];
                    const a1: Ray = arr[1].routeProps[arr[1].which];
                    /*
                    const aMid = a0.computeMidpoint(a1);
                    if (aMid) {
                        arr[0].routeProps[arr[0].which] = new Ray(aMid, a0.dirXZ);
                        arr[1].routeProps[arr[1].which] = new Ray(aMid, a1.dirXZ);
                    }
                    */
                    this.routesDraw.push([{
                        from: a0,
                        to: a1,
                        color: arr[0].routeProps.color,
                        routeId: key2
                    }]);
                }
            }
        }
    }

    getEdges(): Record<string, RailMapEdge> {
        return this.edges;
    }

    getNodes(): RailMapNode[] {
        return this.nodes;
    }

    getRoutes(): RailMapRouteDraw[][] {
        return [...this.routes, ...this.routesDraw];
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