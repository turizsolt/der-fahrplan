import { TileModel } from 'src/Tiles/TileModel';

export class EngineModel extends TileModel {
    public moving: number;
    public id: string;

    public constructor(type:string, id:string, top:number, left:number) {
        super(type, top, left);
        this.id = id;
    }
}
