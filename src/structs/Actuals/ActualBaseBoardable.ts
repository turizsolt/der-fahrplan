import { injectable } from 'inversify';
import { ActualBaseBrick } from './ActualBaseBrick';
import { BaseBoardable } from '../Interfaces/BaseBoardable';
import { Passenger } from '../Interfaces/Passenger';
import { Coordinate } from '../Geometry/Coordinate';

@injectable()
export abstract class ActualBaseBoardable extends ActualBaseBrick
  implements BaseBoardable {
  protected boardedPassengers: Passenger[] = [];

  board(passenger: Passenger): Coordinate {
    this.boardedPassengers.push(passenger);
    return Coordinate.Origo();
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
