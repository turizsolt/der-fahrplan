import { Coordinate } from "../../structs/Geometry/Coordinate";

export interface RailMapNode {
    getName(): string;
    getCoord(): Coordinate;
    getId(): string;
    getType(): symbol;
}
