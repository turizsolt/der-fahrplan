import { WhichEnd } from "../Interfaces/WhichEnd";
import { RoutePartReference } from "./RoutePartReference";

export interface RoutePart {
    setNext(whichEnd: WhichEnd, routePart: RoutePart): void;
    getNext(whichEnd: WhichEnd): RoutePart;

    getName(): string;
    getType(): symbol;
    getRef(): RoutePartReference;

    getDuration(): number;

    isStopping(): boolean;

    persist(): Object;
}
