import { Coordinate } from 'src/Coordinate';
import { Rectangle } from 'src/Rectangle';

export type TileType = "Track"|"Platform"|"PassengerCar"|"DieselEngine";

export class TileModel {
    public type: TileType;
    public center: Coordinate;
    public box: Rectangle;

    public constructor(type: TileType, center: Coordinate, box: Rectangle) {
        this.type = type;
        this.center = center;
        this.box = box;
    }
}
