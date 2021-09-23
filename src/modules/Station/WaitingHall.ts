import { Boardable } from "../../mixins/Boardable";
import { Color } from "../../structs/Color";
import { Coordinate } from "../../structs/Geometry/Coordinate";
import { BaseBrick } from "../../structs/Interfaces/BaseBrick";
import { AbstractPlatform } from "./AbstractPlatform";

export interface WaitingHall extends BaseBrick, Boardable, AbstractPlatform {
    init(position: Coordinate, radius: number): WaitingHall;
    getPosition(): Coordinate;
    getRadius(): number;
    getColor(): Color;
}