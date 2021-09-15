import { Coordinate } from '../structs/Geometry/Coordinate';
import { Passenger } from '../modules/Passenger/Passenger';
import { Boardable } from './Boardable';

export class ActualBoardable implements Boardable {
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
