import { Passenger } from '../../modules/Passenger/Passenger';
import { BaseRenderer } from './BaseRenderer';

export interface PassengerRenderer extends BaseRenderer {
    init(passenger: Passenger): void;
    update();
}
