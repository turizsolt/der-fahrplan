import { WhichEnd } from "../Interfaces/WhichEnd";

export interface RoutePart {
    setNext(whichEnd: WhichEnd, routePart: RoutePart): void;
    getNext(whichEnd: WhichEnd): RoutePart;

    getName(): string;

    getDuration(): number;

    isStopping(): boolean;
}
