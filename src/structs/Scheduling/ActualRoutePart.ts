import { TYPES } from "../../di/TYPES";
import { otherEnd, WhichEnd } from "../Interfaces/WhichEnd";
import { RoutePart } from "./RoutePart";
import { RoutePartReference } from "./RoutePartReference";

export class ActualRoutePart implements RoutePart {
    protected ref: RoutePartReference;

    private next: Record<WhichEnd, RoutePart> = {
        [WhichEnd.A]: null,
        [WhichEnd.B]: null
    };

    constructor(ref: RoutePartReference) {
        this.ref = ref;
    }

    getType(): symbol {
        return TYPES.RoutePart;
    }

    getRef(): RoutePartReference {
        return this.ref;
    }

    setNext(whichEnd: WhichEnd, routePart: RoutePart): void {
        if (this.next[whichEnd] !== routePart) {
            this.next[whichEnd] = routePart;
            routePart?.setNext(otherEnd(whichEnd), this);
        }
    }

    getNext(whichEnd: WhichEnd): RoutePart {
        return this.next[whichEnd];
    }

    getDuration(): number {
        return 0;
    }

    isStopping(): boolean {
        return false;
    }

    getName(): string {
        return this.ref.getName();
    }

    persist(): Object {
        return {
            id: this.ref?.getId(),
            type: this.getType().description
        }
    }
}
