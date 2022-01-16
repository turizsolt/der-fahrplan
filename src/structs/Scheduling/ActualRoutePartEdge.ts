import { ActualRoutePart } from "./ActualRoutePart";
import { RoutePartEdge } from "./RoutePartEdge";
import { RoutePartReferenceDuration } from "./RoutePartReferenceDuration";

export class ActualRoutePartEdge extends ActualRoutePart implements RoutePartEdge {
    protected ref: RoutePartReferenceDuration;

    constructor(ref: RoutePartReferenceDuration) {
        super(ref);
    }

    getDuration(): number {
        return this.ref.getDuration();
    }

    isStopping(): boolean {
        return false;
    }
}
