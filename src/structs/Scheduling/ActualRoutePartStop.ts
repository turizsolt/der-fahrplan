import { WhichEnd } from "../Interfaces/WhichEnd";
import { ActualRoutePart } from "./ActualRoutePart";
import { RoutePartStop } from "./RoutePartStop";

const DEFAULT_DURATION = 30 * 60;

export class ActualRoutePartStop extends ActualRoutePart implements RoutePartStop {
    private duration: number = DEFAULT_DURATION;
    private stopping: boolean = true;

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
}
