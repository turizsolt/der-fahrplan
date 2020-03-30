import { BaseBrick } from './BaseBrick';
import { Passenger } from './Passenger';

export interface BaseBoardable extends BaseBrick {
  board(passenger: Passenger): void;
  unboard(passenger: Passenger): void;
  getBoardedPassengers(): Passenger[];
}
