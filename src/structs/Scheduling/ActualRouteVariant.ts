import { TYPES } from "../../di/TYPES";
import { otherEnd, WhichEnd } from "../Interfaces/WhichEnd";
import { Route } from "./Route";
import { RoutePart } from "./RoutePart";
import { RouteVariant } from "./RouteVariant";

export class ActualRouteVariant implements RouteVariant {
    private startEnd: WhichEnd;
    private route: Route;

    constructor(route: Route, startEnd: WhichEnd) {
        this.route = route;
        this.setStartEnd(startEnd);
    }

    setStartEnd(whichEnd: WhichEnd): void {
        this.startEnd = whichEnd;
    }

    private getParts(): RoutePart[] {
        return this.route.getParts(this.startEnd);
    }

    getFirstStop(): RoutePart {
        return this.route.getEnd(this.startEnd);
    }

    getLastStop(): RoutePart {
        return this.route.getEnd(otherEnd(this.startEnd));
    }

    // todo just return where it stops
    getStops(): RoutePart[] {
        return this.getParts().filter(p => p.getType() === TYPES.RoutePartStop);
    }

    getWaypoints(): RoutePart[] {
        return this.getParts().filter(p => p.getType() === TYPES.RoutePartStop || p.getType() === TYPES.RoutePartJunction);
    }
}
