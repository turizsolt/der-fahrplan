import { Coordinate } from 'src/Geometry/Coordinate';
import { Rectangle } from 'src/Geometry/Rectangle';
import { TileModel, TileType } from '../TileModel';
import { Vector } from 'src/Geometry/Vector';

export class TrackModel extends TileModel {
    public static getSleeperVector(track: TrackModel, sleeper: number): Vector {
        return new Vector(track.center.y, track.box.left+(track.box.getWidth()/track.sleeperCount)*sleeper, 0);
    }

    public constructor(type: TileType, public id:string, public center: Coordinate, public box: Rectangle, public sleeperCount: number, public attachedA: string|null, public attachedB: string|null) {
        super(type, center, box);
        this.sleeperCount = sleeperCount;
        this.id = id;
        this.attachedA = attachedA;
        this.attachedB = attachedB;
    }
}
