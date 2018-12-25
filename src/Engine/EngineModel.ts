import { TileModel } from 'src/Tiles/TileModel';

export class EngineModel extends TileModel {
    public moving: number;
    public willStopOnTile: boolean;
    public id: string;

    public constructor(id:string, top:number, left:number) {
        super("DieselEngine", top, left);
        this.id = id;
        this.moving = 0;
        this.willStopOnTile = false;
    }
}
