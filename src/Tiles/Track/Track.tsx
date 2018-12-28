import {ITileProps, Tile } from '../Tile';
import { TileModel } from '../TileModel';

export class Track extends Tile {

    public constructor(props:ITileProps<TileModel>) {
        super(props);

        this.image = "tiles/track-line.svg";
    }
}
