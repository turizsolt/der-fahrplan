import { Coordinate } from '../structs/Geometry/Coordinate';
import { Passenger } from '../structs/Interfaces/Passenger';

export class Boardable {
  private boardedPassengers: Passenger[];

  init(...args: any[]) {
    this.boardedPassengers = [];
  }

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
