import { WhichEnd } from "../Interfaces/WhichEnd";
import { RoutePart } from "./RoutePart";

export interface Route2 {
    getNo(): string;
    setNo(no: string): void;

    getColor(): string;
    setColor(color: string): void;

    addPart(whichEnd: WhichEnd, part: RoutePart): void;
    getParts(whichEnd: WhichEnd): RoutePart[];
    removePart(whichEnd: WhichEnd): void;
}
