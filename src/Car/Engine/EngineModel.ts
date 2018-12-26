import { CarModel } from '../CarModel';

export class EngineModel extends CarModel {
    public moving: number;
    public willStopOnTile: boolean;
    
    public constructor(id:string, top:number, left:number, attachedA:string|null, attachedB:string|null) {
        super("DieselEngine", id, top, left, attachedA, attachedB);
        this.moving = 0;
        this.willStopOnTile = false;
    }
}
