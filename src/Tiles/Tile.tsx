import * as React from 'react';
import { TileModel } from './TileModel';

export class Tile<State> extends React.Component<ITileProps, State> {
    protected image:string;

    public constructor(props:ITileProps, state: State) {
        super(props, state);

        this.onClick = this.onClick.bind(this);
    }

    public render() {
        return <img src={this.image} onClick={this.onClick} style={{position: "absolute", left: this.props.left+"px", top: this.props.top+"px", width: "60px", height: "30px"}} />
    }

    protected onClick(event: any) {
        if(this.props.onClick) { this.props.onClick(event); }
    }
}

export interface ITileProps {
    left: number;
    top: number;
    id?: string;
    model?: TileModel;
    onClick?: (event:any) => void;
}
