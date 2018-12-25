import { TileModel } from 'src/Tiles/TileModel';

export class PassengerCarModel extends TileModel {
    public draggedBy: string;
    public id:string;

    public constructor(id:string, draggedBy:string, top:number, left:number) {
        super("PassengerCar", top, left);
        this.draggedBy = draggedBy;
        this.id = id;
    }
}
