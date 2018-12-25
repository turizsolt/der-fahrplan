import { TileModel } from 'src/Tiles/TileModel';

export class EngineModel extends TileModel {
    public moving: number;
    public willStopOnTile: boolean;
    public id: string;
    public attachedA: string|null;
    public attachedB: string|null;
    public lastDragged: string;

    public constructor(id:string, top:number, left:number, attachedA:string|null, attachedB:string|null, lastDragged:string) {
        super("DieselEngine", top, left);
        this.id = id;
        this.moving = 0;
        this.willStopOnTile = false;
        this.attachedA = attachedA;
        this.attachedB = attachedB;
        this.lastDragged = lastDragged;
    }
}
