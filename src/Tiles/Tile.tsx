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
            borderLeft: "1px dotted red",
            borderRight: "1px dotted blue",
            position: "absolute",
        }} />
    }
}

export interface ITileProps<Type> {
    model: Type;
}
