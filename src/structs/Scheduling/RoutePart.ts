import { WhichEnd } from "../Interfaces/WhichEnd";

export interface RoutePart {
    setNext(whichEnd: WhichEnd, routePart: RoutePart): void;
    getNext(whichEnd: WhichEnd): RoutePart;

    getName(): string;
    getType(): symbol;

    getDuration(): number;

    isStopping(): boolean;
}
