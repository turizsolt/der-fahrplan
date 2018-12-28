import { TileModel, TileType } from 'src/Tiles/TileModel';
import { Coordinate } from 'src/Geometry/Coordinate';
import { Rectangle } from 'src/Geometry/Rectangle';
import { TrackModel } from 'src/Tiles/Track/TrackModel';

export class CarModel extends TileModel {

    public static moveTo(car:CarModel, track: TrackModel, sleeper: number): CarModel {
        const newVector = TrackModel.getSleeperVector(track, sleeper);
        const newCenter = new Coordinate(newVector.y, newVector.x);
        const diffX = newVector.x - car.center.x;
        const diffY = newVector.y - car.center.y;
        const newBox = new Rectangle(car.box.top+diffY, car.box.left+diffX, car.box.bottom+diffY, car.box.right+diffX);
        return new CarModel(car.type, car.id, newCenter, newBox, car.attachedA, car.attachedB, car.trackId, sleeper);
    }

    public constructor(type:TileType, public id:string, center: Coordinate, box: Rectangle, public attachedA:string|null, public attachedB:string|null, public trackId: string, public sleeper: number) {
        super(type, center, box);
    }
}
