import {ITileProps, ITileState, Tile } from './Tile';

export class Track extends Tile {

    public constructor(props:ITileProps, state:ITileState) {
        super(props, state);

        this.image = "tiles/track-line.svg";
    }
}
