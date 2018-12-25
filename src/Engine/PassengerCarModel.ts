import { TileModel } from 'src/Tiles/TileModel';

export class PassengerCarModel extends TileModel {
    public draggedBy: string;

    public constructor(type:string, draggedBy:string, top:number, left:number) {
        super(type, top, left);
        this.draggedBy = draggedBy;
    }
}
