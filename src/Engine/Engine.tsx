import * as React from 'react';
import {ITileProps, Tile } from '../Tiles/Tile';

export class Engine extends Tile<IEngineState> {

    public constructor(props:ITileProps, state:IEngineState) {
        super(props, state);

        this.image = "tiles/engine-diesel.svg";

        this.state = {
            left: this.props.left,
            top: this.props.top,
        };
    }

    public render() {
        return <img 
            src={this.image}
            style={{position: "absolute", left: this.state.left+"px", top: this.state.top+"px", width: "60px", height: "30px"}} 
            onClick={this.onClick}
            id={this.props.id}  
        />
    }
}

export interface IEngineState {
    left: number;
    top: number;
}
