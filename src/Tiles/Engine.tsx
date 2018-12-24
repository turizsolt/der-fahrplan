import * as React from 'react';
import {ITileProps, Tile } from './Tile';

export class Engine extends Tile<IEngineState> {

    public constructor(props:ITileProps, state:IEngineState) {
        super(props, state);

        this.image = "tiles/engine-diesel.svg";

        this.state = {
            left: this.props.left,
            moving: 0,
            top: this.props.top,
        };

        this.onClick = this.onClick.bind(this);
        this.onTick = this.onTick.bind(this);

        setInterval(this.onTick, 100);
    }

    public render() {
        return <img 
            src={this.image}
            style={{position: "absolute", left: this.state.left+"px", top: this.state.top+"px", width: "60px", height: "30px"}}
            onClick={this.onClick}
        />
    }

    private onClick() {
        this.setState((state:IEngineState) => ({
            ...state,
            moving: state.moving?0:1,
        }));
    }

    private onTick() {
        if(!this.state.moving) { return; }

        this.setState((state:IEngineState) => ({
            ...state,
            left: state.left+1,
        }));
    }
}

export interface IEngineState {
    left: number;
    moving: number;
    top: number;
}
