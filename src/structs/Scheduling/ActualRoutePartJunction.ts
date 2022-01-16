import { ActualRoutePart } from "./ActualRoutePart";
import { RoutePartJunction } from "./RoutePartJunction";

const DEFAULT_DURATION = 0;

export class ActualRoutePartJunction extends ActualRoutePart implements RoutePartJunction {
    private duration: number = DEFAULT_DURATION;

    setDuration(duration: number): void {
        this.duration = duration;
    }

    getDuration(): number {
        return this.duration;
    }

    isStopping(): boolean {
        return false;
    }
}
