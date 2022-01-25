import { TYPES } from "../../di/TYPES";
import { ActualRoutePart } from "./ActualRoutePart";
import { RoutePartJunction } from "./RoutePartJunction";

const DEFAULT_DURATION = 0;

export class ActualRoutePartJunction extends ActualRoutePart implements RoutePartJunction {
    private duration: number = DEFAULT_DURATION;

    getType(): symbol {
        return TYPES.RoutePartJunction;
    }

    setDuration(duration: number): void {
        this.duration = duration;
    }

    getDuration(): number {
        return this.duration;
    }

    isStopping(): boolean {
        return false;
    }

    persist(): Object {
        return {
            id: this.ref?.getId(),
            type: this.getType().description,
            duration: this.duration
        }
    }
}
