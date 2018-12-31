import { TileModel, TileType } from 'src/Tiles/TileModel';
import { Coordinate } from 'src/Geometry/Coordinate';
import { Rectangle } from 'src/Geometry/Rectangle';
import { TrackModel } from 'src/Tiles/Track/TrackModel';
import { TrackSModel } from 'src/Tiles/Track/TrackSModel';
import { Vector } from 'src/Geometry/Vector';
import { SwitchModelRight } from 'src/Tiles/Track/SwitchModelRight';
import { SwitchModelLeft } from 'src/Tiles/Track/SwitchModelLeft';

export class CarModel extends TileModel {

    public static moveTo(car:CarModel, track: TrackModel, sleeper: number): CarModel {
        let newVector:Vector;
        if(track.type === "TrackS") {
            newVector = TrackSModel.getSleeperVector(track, sleeper);
        } else if(track.type === "SwitchRight") {
            newVector = SwitchModelRight.getSleeperVector(track as SwitchModelRight, sleeper);
        } else if(track.type === "SwitchLeft") {
            newVector = SwitchModelLeft.getSleeperVector(track as SwitchModelLeft, sleeper);
        } else {
            newVector = TrackModel.getSleeperVector(track, sleeper);
        }
        const newCenter = new Coordinate(newVector.y, newVector.x);
        const diffX = newVector.x - car.center.x;
        const diffY = newVector.y - car.center.y;
        const newBox = new Rectangle(car.box.top+diffY, car.box.left+diffX, car.box.bottom+diffY, car.box.right+diffX);
        return new CarModel(car.type, car.id, newCenter, newBox, car.attachedA, car.attachedB, track.id, sleeper);
    }

    public constructor(type:TileType, public id:string, center: Coordinate, box: Rectangle, public attachedA:string|null, public attachedB:string|null, public trackId: string, public sleeper: number) {
        super(type, center, box);
    }
}
