import { Boardable } from "../../mixins/Boardable";
import { Color } from "../../structs/Color";
import { Coordinate } from "../../structs/Geometry/Coordinate";
import { BaseBrick } from "../../structs/Interfaces/BaseBrick";
import { Station } from "./Station";

export interface WaitingHall extends BaseBrick, Boardable {
    init(position: Coordinate, radius: number): WaitingHall;
    getPosition(): Coordinate;
    getRadius(): number;
    setStation(station: Station): void;
    getStation(): Station;
    getColor(): Color;
}