import { WhichEnd } from "../Interfaces/WhichEnd";
import { Route2 } from "./Route2";
import { RoutePart } from "./RoutePart";

export class ActualRoute2 implements Route2 {
    private no: string;
    private color: string;
    private parts: Record<WhichEnd, RoutePart> = {
        A: null,
        B: null
    }

    constructor(no: string, color: string) {
        this.setNo(no);
        this.setColor(color);
    }

    getNo(): string {
        return this.no;
    }

    setNo(no: string): void {
        this.no = no;
    }

    getColor(): string {
        return this.color;
    }

    setColor(color: string): void {
        this.color = color;
    }

    addPart(whichEnd: WhichEnd, part: RoutePart): void {
        if (!this.parts.A) {
            this.parts.A = part;
            this.parts.B = part;
        } else {
            const p = this.parts[whichEnd];
            part.setNext(whichEnd, p);
            this.parts[whichEnd] = part;
        }
    }

    getParts(whichEnd: WhichEnd): RoutePart[] {
        const result: RoutePart[] = [];
        let iter: RoutePart = this.parts[whichEnd];
        while (iter) {
            result.push(iter);
            iter = iter.getNext(whichEnd);
        }
        return result;
    }
}
