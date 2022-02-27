import { getTestStore } from "../../../test/getTestStore";
import { TYPES } from "../../di/TYPES";
import { ActualRoutePart } from "../Scheduling/ActualRoutePart";
import { ActualRoutePartEdge } from "../Scheduling/ActualRoutePartEdge";
import { ActualRoutePartJunction } from "../Scheduling/ActualRoutePartJunction";
import { ActualRoutePartStop } from "../Scheduling/ActualRoutePartStop";
import { Route } from "../Scheduling/Route";
import { RoutePart } from "../Scheduling/RoutePart";
import { RoutePartEdge } from "../Scheduling/RoutePartEdge";
import { RoutePartJunction } from "../Scheduling/RoutePartJunction";
import { RoutePartReference } from "../Scheduling/RoutePartReference";
import { RoutePartReferenceColor } from "../Scheduling/RoutePartReferenceColor";
import { RoutePartReferenceDuration } from "../Scheduling/RoutePartReferenceDuration";
import { RoutePartStop } from "../Scheduling/RoutePartStop";

const store = getTestStore();

export class BrickFactory {
    // todo
    createRoute(no: string, color: string): Route {
        const route = store.create<Route>(TYPES.Route).init();
        route.setName(no);
        route.setColor(color);
        return route;
    }

    createRoutePart(ref: RoutePartReference): RoutePart {
        return new ActualRoutePart(ref);
    }

    createRoutePartStop(ref: RoutePartReferenceColor): RoutePartStop {
        return new ActualRoutePartStop(ref);
    }

    createRoutePartJunction(ref: RoutePartReference): RoutePartJunction {
        return new ActualRoutePartJunction(ref);
    }

    createRoutePartEdge(ref: RoutePartReferenceDuration): RoutePartEdge {
        return new ActualRoutePartEdge(ref);
    }

    /* singleton pattern */

    private static __instance: BrickFactory = null;

    static getInstance(): BrickFactory {
        if (!BrickFactory.__instance) {
            BrickFactory.__instance = new BrickFactory();
        }
        return BrickFactory.__instance;
    }
}
