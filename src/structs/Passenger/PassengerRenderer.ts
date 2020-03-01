import { Passenger } from './Passenger';

export interface PassengerRenderer {
  init(passenger: Passenger): void;
  update();
}
