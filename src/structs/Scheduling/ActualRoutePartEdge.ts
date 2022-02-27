import { TYPES } from "../../di/TYPES";
import { WhichEnd } from "../Interfaces/WhichEnd";
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
        const adjacentStops = (this.getNext(WhichEnd.A)?.isStopping() ? 1 : 0) + (this.getNext(WhichEnd.B)?.isStopping() ? 1 : 0);
        return (this.ref?.getDuration() || 0) + adjacentStops * 50;
    }

    isStopping(): boolean {
        return false;
    }

    persist(): Object {
        return {
            id: this.ref?.getId(),
            type: this.getType().description,
            duration: this.ref?.getDuration() || 0
        }
    }
}
