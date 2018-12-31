import { Coordinate } from 'src/Geometry/Coordinate';
import { Rectangle } from 'src/Geometry/Rectangle';

export type TileType = "Track"|"TrackS"|"SwitchLeft"|"SwitchRight"|"Platform"|"PassengerCar"|"DieselEngine";

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
