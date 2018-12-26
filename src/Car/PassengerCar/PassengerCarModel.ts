import { CarModel } from '../CarModel';

export class PassengerCarModel extends CarModel {
    
    public constructor(id:string, top:number, left:number, attachedA:string|null, attachedB:string|null) {
        super("PassengerCar", id, top, left, attachedA, attachedB);
    }
}
