import { TileModel } from 'src/Tiles/TileModel';

export class CarModel extends TileModel {
    public id: string;
    public attachedA: string|null;
    public attachedB: string|null;
    
    public constructor(type:string, id:string, top:number, left:number, attachedA:string|null, attachedB:string|null) {
        super(type, top, left);
        this.id = id;
        this.attachedA = attachedA;
        this.attachedB = attachedB;
    }
}
