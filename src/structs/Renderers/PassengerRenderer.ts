import { Passenger } from '../Actuals/Passenger';

export interface PassengerRenderer {
  init(passenger: Passenger): void;
  update();
}
