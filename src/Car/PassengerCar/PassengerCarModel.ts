import { CarModel } from '../CarModel';
import { Rectangle } from 'src/Rectangle';
import { Coordinate } from 'src/Coordinate';

export class PassengerCarModel extends CarModel {
    
    public constructor(id:string, center: Coordinate, box: Rectangle, attachedA:string|null, attachedB:string|null) {
        super("PassengerCar", id, center, box, attachedA, attachedB);
    }
}
