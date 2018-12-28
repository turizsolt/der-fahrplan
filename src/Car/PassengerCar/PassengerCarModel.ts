import { CarModel } from '../CarModel';
import { Rectangle } from 'src/Geometry/Rectangle';
import { Coordinate } from 'src/Geometry/Coordinate';

export class PassengerCarModel extends CarModel {
    
    public constructor(id:string, center: Coordinate, box: Rectangle, attachedA:string|null, attachedB:string|null, trackId: string, sleeper: number) {
        super("PassengerCar", id, center, box, attachedA, attachedB, trackId, sleeper);
    }
}
