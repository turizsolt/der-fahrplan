import { ActualRoute2 } from "../Scheduling/ActualRoute2";
import { ActualRoutePart } from "../Scheduling/ActualRoutePart";
import { ActualRoutePartEdge } from "../Scheduling/ActualRoutePartEdge";
import { ActualRoutePartJunction } from "../Scheduling/ActualRoutePartJunction";
import { ActualRoutePartStop } from "../Scheduling/ActualRoutePartStop";
import { Route2 } from "../Scheduling/Route2";
import { RoutePart } from "../Scheduling/RoutePart";
import { RoutePartEdge } from "../Scheduling/RoutePartEdge";
import { RoutePartJunction } from "../Scheduling/RoutePartJunction";
import { RoutePartStop } from "../Scheduling/RoutePartStop";

export class BrickFactory {
    createRoute2(no: string, color: string): Route2 {
        return new ActualRoute2(no, color);
    }

    createRoutePart(): RoutePart {
        return new ActualRoutePart();
    }

    createRoutePartStop(): RoutePartStop {
        return new ActualRoutePartStop();
    }

    createRoutePartJunction(): RoutePartJunction {
        return new ActualRoutePartJunction();
    }

    createRoutePartEdge(edge: { duration: number }): RoutePartEdge {
        return new ActualRoutePartEdge(edge);
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
