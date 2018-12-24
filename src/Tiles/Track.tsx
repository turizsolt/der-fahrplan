import {ITileProps, Tile } from './Tile';

export class Track extends Tile<{}> {

    public constructor(props:ITileProps, state:{}) {
        super(props, state);

        this.image = "tiles/track-line.svg";
    }
}
