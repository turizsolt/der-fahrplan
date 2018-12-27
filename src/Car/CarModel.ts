import { TileModel, TileType } from 'src/Tiles/TileModel';
import { Coordinate } from 'src/Coordinate';
import { Rectangle } from 'src/Rectangle';

export class CarModel extends TileModel {
    public id: string;
    public attachedA: string|null;
    public attachedB: string|null;
    
    public constructor(type:TileType, id:string, center: Coordinate, box: Rectangle, attachedA:string|null, attachedB:string|null) {
        super(type, center, box);
        this.id = id;
        this.attachedA = attachedA;
        this.attachedB = attachedB;
    }
}
