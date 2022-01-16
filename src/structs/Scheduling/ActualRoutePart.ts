import { otherEnd, WhichEnd } from "../Interfaces/WhichEnd";
import { RoutePart } from "./RoutePart";

export class ActualRoutePart implements RoutePart {
    private next: Record<WhichEnd, RoutePart> = {
        [WhichEnd.A]: null,
        [WhichEnd.B]: null
    };

    setNext(whichEnd: WhichEnd, routePart: RoutePart): void {
        if (this.next[whichEnd] !== routePart) {
            this.next[whichEnd] = routePart;
            routePart.setNext(otherEnd(whichEnd), this);
        }
    }

    getNext(whichEnd: WhichEnd): RoutePart {
        return this.next[whichEnd];
    }

    getDuration(): number {
        return 0;
    }
}
