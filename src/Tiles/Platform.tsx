import {ITileProps, Tile } from './Tile';

export class Platform extends Tile<{}> {

    public constructor(props:ITileProps, state:{}) {
        super(props, state);

        this.image = "tiles/platform.svg";
    }
}
