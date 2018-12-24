import {ITileProps, Tile } from './Tile';

export class PassengerCar extends Tile<{}> {

    public constructor(props:ITileProps, state:{}) {
        super(props, state);

        this.image = "tiles/passenger-car.svg";
    }
}
