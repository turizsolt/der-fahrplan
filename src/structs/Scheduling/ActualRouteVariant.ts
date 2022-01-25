import { TYPES } from "../../di/TYPES";
import { applyMixins } from "../../mixins/ApplyMixins";
import { Emitable } from "../../mixins/Emitable";
import { ActualBaseStorable } from "../Actuals/ActualStorable";
import { Store } from "../Interfaces/Store";
import { otherEnd, WhichEnd } from "../Interfaces/WhichEnd";
import { Route } from "./Route";
import { RoutePart } from "./RoutePart";
import { RouteVariant } from "./RouteVariant";

export interface ActualRouteVariant extends Emitable { }
const doApply = () => applyMixins(ActualRouteVariant, [Emitable]);
export class ActualRouteVariant extends ActualBaseStorable implements RouteVariant {
    private startEnd: WhichEnd;
    private route: Route;

    init(route: Route, startEnd: WhichEnd): RouteVariant {
        this.initStore(TYPES.RouteVariant);

        this.route = route;
        this.setStartEnd(startEnd);

        return this;
    }

    getRoute(): Route {
        return this.route;
    }

    getColor(): string {
        return this.route.getColor();
    }

    getName(): string {
        return this.route.getName();
    }

    setStartEnd(whichEnd: WhichEnd): void {
        this.startEnd = whichEnd;
    }

    getStartEnd(): WhichEnd {
        return this.startEnd;
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

    hasCommonEdgeWith(routeVariant: RouteVariant): boolean {
        return this.route.hasCommonEdgeWith(routeVariant.getRoute());
    }

    persist(): Object {
        return {
            id: this.id,
            type: 'RouteVariant',
            startEnd: this.startEnd,
            route: this.route.getId()
        }
    }

    load(obj: any, store: Store): void {
        this.presetId(obj.id);
        this.init(store.get(obj.route) as Route, obj.startEnd);
    }
}
doApply();
