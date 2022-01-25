import { TYPES } from "../../di/TYPES";
import { ActualRoutePart } from "./ActualRoutePart";
import { RoutePartEdge } from "./RoutePartEdge";
import { RoutePartReferenceDuration } from "./RoutePartReferenceDuration";

export class ActualRoutePartEdge extends ActualRoutePart implements RoutePartEdge {
    protected ref: RoutePartReferenceDuration;

    constructor(ref: RoutePartReferenceDuration) {
        super(ref);
    }

    getType(): symbol {
        return TYPES.RoutePartEdge;
    }

    getDuration(): number {
        return this.ref.getDuration();
    }

    isStopping(): boolean {
        return false;
    }

    persist(): Object {
        return {
            id: this.ref?.getId(),
            type: this.getType().description
        }
    }
}
