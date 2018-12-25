import * as React from 'react';
import {ITileProps, Tile } from '../Tiles/Tile';

export class Engine extends Tile<{}> {

    public constructor(props:ITileProps, state:{}) {
        super(props, state);

        this.image = "tiles/engine-diesel.svg";
    }

    public render() {
        return <img 
            src={this.image}
            style={{position: "absolute", left: this.props.left+"px", top: this.props.top+"px", width: "60px", height: "30px"}} 
            onClick={this.onClick}
            onDoubleClick={this.onDoubleClick}
            id={this.props.id}  
        />
    }
}
