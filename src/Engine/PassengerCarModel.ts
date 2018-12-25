import { TileModel } from 'src/Tiles/TileModel';

export class PassengerCarModel extends TileModel {
    public draggedBy: string|null;
    public id:string;
    public attachedA: string|null;
    public attachedB: string|null;

    public constructor(id:string, draggedBy:string, top:number, left:number, attachedA:string|null, attachedB:string|null) {
        super("PassengerCar", top, left);
        this.draggedBy = draggedBy;
        this.id = id;
        this.attachedA = attachedA;
        this.attachedB = attachedB;
    }
}
