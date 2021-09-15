import { Coordinate } from '../structs/Geometry/Coordinate';
import { Passenger } from '../modules/Passenger/Passenger';

export interface Boardable {
    board(passenger: Passenger): Coordinate;
    unboard(passenger: Passenger): void;
    getBoardedPassengers(): Passenger[];
}
