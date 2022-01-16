import { ActualRoute2 } from "../Scheduling/ActualRoute2";
import { ActualRoutePart } from "../Scheduling/ActualRoutePart";
import { ActualRoutePartEdge } from "../Scheduling/ActualRoutePartEdge";
import { ActualRoutePartJunction } from "../Scheduling/ActualRoutePartJunction";
import { ActualRoutePartStop } from "../Scheduling/ActualRoutePartStop";
import { Route2 } from "../Scheduling/Route2";
import { RoutePart } from "../Scheduling/RoutePart";
import { RoutePartEdge } from "../Scheduling/RoutePartEdge";
import { RoutePartJunction } from "../Scheduling/RoutePartJunction";
import { RoutePartReference } from "../Scheduling/RoutePartReference";
import { RoutePartReferenceColor } from "../Scheduling/RoutePartReferenceColor";
import { RoutePartReferenceDuration } from "../Scheduling/RoutePartReferenceDuration";
import { RoutePartStop } from "../Scheduling/RoutePartStop";

export class BrickFactory {
    createRoute2(no: string, color: string): Route2 {
        return new ActualRoute2(no, color);
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