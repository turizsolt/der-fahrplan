import { ActualRoutePart } from "./ActualRoutePart";
import { RoutePartEdge } from "./RoutePartEdge";

export class ActualRoutePartEdge extends ActualRoutePart implements RoutePartEdge {
    private ref: { duration: number };

    constructor(ref: { duration: number }) {
        super();
        this.ref = ref;
    }

    getDuration(): number {
        return this.ref.duration;
    }

    isStopping(): boolean {
        return false;
    }
}
