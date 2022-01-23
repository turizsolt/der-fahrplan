import { TYPES } from "../../di/TYPES";
import { WhichEnd } from "../Interfaces/WhichEnd";
import { ActualRoutePart } from "./ActualRoutePart";
import { RoutePartReferenceColor } from "./RoutePartReferenceColor";
import { RoutePartStop } from "./RoutePartStop";

const DEFAULT_DURATION = 30 * 60;

export class ActualRoutePartStop extends ActualRoutePart implements RoutePartStop {
    protected ref: RoutePartReferenceColor;

    private duration: number = DEFAULT_DURATION;
    private stopping: boolean = true;

    constructor(ref: RoutePartReferenceColor) {
        super(ref);
    }

    getType(): symbol {
        return TYPES.RoutePartStop;
    }

    setDuration(duration: number): void {
        this.duration = duration;
    }

    getDuration(): number {
        if (!this.getNext(WhichEnd.A)) return 0;
        if (!this.getNext(WhichEnd.B)) return 0;
        return this.duration;
    }

    isStopping(): boolean {
        return this.stopping;
    }

    setStopping(stopping: boolean): void {
        this.stopping = stopping;
    }

    getColor(): string {
        return this.ref.getColor();
    }
}
