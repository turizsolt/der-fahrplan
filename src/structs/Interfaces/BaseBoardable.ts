import { BaseBrick } from './BaseBrick';
import { Passenger } from './Passenger';
import { Coordinate } from '../Geometry/Coordinate';

export interface BaseBoardable extends BaseBrick {
  board(passenger: Passenger): Coordinate;
  unboard(passenger: Passenger): void;
  getBoardedPassengers(): Passenger[];
}
