import * as React from 'react';
import { TileModel } from './TileModel';

export abstract class Tile extends React.Component<ITileProps<TileModel>, {}> {
    protected image:string;

    public constructor(props:ITileProps<TileModel>) {
        super(props);
    }

    public render() {
        return <div style={{
            ...this.props.model.box.getPositionStyle(),
            backgroundImage: "url("+this.image+")",
            backgroundRepeat: "repeat",
            position: "absolute",
        }} />
    }
}

export interface ITileProps<Type> {
    model: Type;
}
