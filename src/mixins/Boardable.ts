import { Coordinate } from '../structs/Geometry/Coordinate';
import { Passenger } from '../structs/Interfaces/Passenger';

export interface Boardable {
  board(passenger: Passenger): Coordinate;
  unboard(passenger: Passenger): void;
  getBoardedPassengers(): Passenger[];
}
