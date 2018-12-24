import * as React from 'react';

export class Tile extends React.Component<ITileProps, ITileState> {
    protected image:string;

    public constructor(props:ITileProps, state: ITileState) {
        super(props, state);
    }

    public render() {
        return <img src={this.image} style={{position: "absolute", left: this.props.left+"px", top: this.props.top+"px", width: "60px", height: "30px"}} />
    }
}

export interface ITileProps {
    left: number;
    top: number;
}

export interface ITileState {
    randomState: null;
}
