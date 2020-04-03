import { Passenger } from '../Interfaces/Passenger';
import { BaseRenderer } from './BaseRenderer';

export interface PassengerRenderer extends BaseRenderer {
  init(passenger: Passenger): void;
  update();
}
