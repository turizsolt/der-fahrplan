import {ITileProps, Tile } from '../Tile';
import { TileModel } from '../TileModel';

export class Platform extends Tile {

    public constructor(props:ITileProps<TileModel>) {
        super(props);

        this.image = "tiles/platform.svg";
    }  
}
