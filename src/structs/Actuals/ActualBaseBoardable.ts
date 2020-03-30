import { injectable } from 'inversify';
import { ActualBaseBrick } from './ActualBaseBrick';
import { BaseBoardable } from '../Interfaces/BaseBoardable';
import { Passenger } from '../Interfaces/Passenger';

@injectable()
export abstract class ActualBaseBoardable extends ActualBaseBrick
  implements BaseBoardable {
  protected boardedPassengers: Passenger[] = [];

  board(passenger: Passenger): void {
    this.boardedPassengers.push(passenger);
  }

  unboard(passenger: Passenger): void {
    this.boardedPassengers = this.boardedPassengers.filter(
      x => x !== passenger
    );
  }

  getBoardedPassengers(): Passenger[] {
    return this.boardedPassengers;
  }
}
