import { CarModel } from '../CarModel';
import { Coordinate } from 'src/Coordinate';
import { Rectangle } from 'src/Rectangle';

export class EngineModel extends CarModel {
    public moving: number;
    public willStopOnTile: boolean;
    
    public constructor(id:string, center: Coordinate, box: Rectangle,  attachedA:string|null, attachedB:string|null) {
        super("DieselEngine", id, center, box, attachedA, attachedB);
        this.moving = 0;
        this.willStopOnTile = false;
    }
}
