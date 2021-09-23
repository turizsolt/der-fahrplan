import { Coordinate } from '../structs/Geometry/Coordinate';
import { Passenger } from '../modules/Passenger/Passenger';
import { ActualBoardable } from './ActualBoardable';
import { Wagon } from '../structs/Interfaces/Wagon';
import { Store } from '../structs/Interfaces/Store';
import { Left } from '../structs/Geometry/Directions';

export type PassengerArrangement = { rows: number; seats: number };

export class BoardableWagon extends ActualBoardable {
    private seatCount: number = 21;
    private seatColumns: number = 3;
    private passengerCount: number = 0;
    private seats: Passenger[] = [];

    constructor(private parent: Wagon, config?: PassengerArrangement) {
        super();
        if (config) {
            this.seatColumns = config.seats;
            this.seatCount = config.rows * config.seats;
        }
    }

    getPassengerArrangement(): PassengerArrangement {
        return {
            seats: this.seatColumns,
            rows: this.seatCount / this.seatColumns
        };
    }

    getPassengerCount(): number {
        return this.seatColumns * this.seatCount;
    }

    board(passenger: Passenger): Coordinate {
        if (this.passengerCount >= this.seatCount) {
            return null;
        }

        this.passengerCount += 1;
        let seatNo: number;
        do {
            seatNo = (Math.random() * this.seatCount) | 0;
        } while (this.seats[seatNo]);
        this.seats[seatNo] = passenger;

        const ray = this.seatOffset(seatNo);
        return ray && ray.coord;
    }

    unboard(passenger: Passenger): void {
        const seatNo = this.seats.findIndex(x => x === passenger);
        if (seatNo !== -1) {
            this.seats[seatNo] = undefined;
            this.passengerCount -= 1;
        }
    }

    getBoardedPassengers(): Passenger[] {
        return this.seats.filter(x => x);
    }

    hasFreeSeat(): boolean {
        return this.seatCount > this.passengerCount;
    }

    moveBoardedPassengers() {
        this.seats.map((pass, seatNo) => {
            if (pass) {
                pass.updatePos(this.seatOffset(seatNo).coord);
            }
        });
    }

    setSeatCount(count: number, columns: number = 3) {
        this.seatCount = count;
        this.seatColumns = columns;
    }

    persist(): any {
        return {
            seatCount: this.seatCount,
            seatColumns: this.seatColumns,
            seats: this.seats.map(p => p && p.getId())
        };
    }

    load(seats: any, store: Store): void {
        this.seats = seats.map(s => (s ? store.get(s.id) : undefined));
    }

    private seatOffset(seatNo) {
        // if (!this.parent.getWorm() || this.parent.getWorm().getAll().length === 0)
        //   return null;

        const colSize = 1.2;
        const rowSize = 1.2;
        const colCount = this.seatColumns - 1;
        const rowCount = Math.ceil(this.seatCount / (colCount + 1)) - 1;

        const col = seatNo % 3;
        const row = (seatNo - col) / 3;
        return this.parent
            .getCenterRay()
            .fromHere(Left, -((colCount / 2) * colSize) + col * colSize)
            .fromHere(0, (rowCount / 2) * rowSize - row * rowSize);
    }
}
