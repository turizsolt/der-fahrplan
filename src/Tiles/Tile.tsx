import * as React from 'react';
import { TileModel } from './TileModel';

export class Tile<State> extends React.Component<ITileProps, State> {
    protected image:string;

    public constructor(props:ITileProps, state: State) {
        super(props, state);

        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
    }

    public render() {
        return <img src={this.image} onClick={this.onClick} onDoubleClick={this.onDoubleClick} style={{position: "absolute", left: this.props.left+"px", top: this.props.top+"px", width: "60px", height: "30px"}} />
    }

    protected onClick(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onClick) { this.props.onClick(event); }
    }

    protected onDoubleClick(event: React.MouseEvent<HTMLElement>) {
        if(this.props.onDoubleClick) { this.props.onDoubleClick(event); }
    }
}

export interface ITileProps {
    left: number;
    top: number;
    id?: string;
    model?: TileModel;
    onClick?: (event:React.MouseEvent<HTMLElement>) => void;
    onDoubleClick?: (event:React.MouseEvent<HTMLElement>) => void;
}
