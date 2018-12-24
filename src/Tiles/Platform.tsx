import {ITileProps, ITileState, Tile } from './Tile';

export class Platform extends Tile {

    public constructor(props:ITileProps, state:ITileState) {
        super(props, state);

        this.image = "tiles/platform.svg";
    }
}
