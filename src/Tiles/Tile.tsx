import * as React from 'react';

export class Tile<State> extends React.Component<ITileProps, State> {
    protected image:string;

    public constructor(props:ITileProps, state: State) {
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
