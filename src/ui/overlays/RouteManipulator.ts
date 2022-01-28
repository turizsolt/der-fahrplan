import { RailMap } from "../../modules/RailMap/RailMap";
import { RailMapNode } from "../../modules/RailMap/RailMapNode";
import { WhichEnd } from "../../structs/Interfaces/WhichEnd";
import { Route } from "../../structs/Scheduling/Route";
import { RouteVariant } from "../../structs/Scheduling/RouteVariant";

export class RouteManipulator {
    isOnRoute(route: Route, node: RailMapNode): boolean {
        return route.getParts(WhichEnd.A).some(p => p.getRef() === node);
    }

    isRouteEmpty(route: Route): boolean {
        return !route.getEnd(WhichEnd.A);
    }

    findShortestRoute(map: RailMap, routeVariant: RouteVariant, fromNode: RailMapNode, toNode: RailMapNode) {
        const forbiddenNodes: RailMapNode[] = routeVariant.getWaypoints().map(w => w.getRef()) as RailMapNode[];
        let distance: number = 0;
        const result = map.getShortestPath(
            fromNode,
            toNode,
            forbiddenNodes
        );
        if (!result) {
            return { addingStations: [], distance: Number.POSITIVE_INFINITY };
        }
        for (let i = 1; i < result.length; i++) {
            distance += map.getDistance(result[i - 1], result[i]);
        }
        return { addingStations: result.slice(1), distance };
    }
}
