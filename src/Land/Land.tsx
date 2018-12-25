import * as React from 'react';
import { Engine } from '../Engine/Engine';
import { PassengerCar } from '../Tiles/PassengerCar';
import { Platform } from '../Tiles/Platform';
import { Track } from '../Tiles/Track';
import { LandModel } from './LandModel';

export class Land extends React.Component<any, any> {

    public constructor(props:any, state:any) {
        super(props, state);

        this.onEngineClicked = this.onEngineClicked.bind(this);
        this.onTick = this.onTick.bind(this);

        setInterval(this.onTick, 5000);
    }

    public render() {
        return (
            <div style={{position: "absolute"}}>
                {
                    this.props.model.tileList.map((tile: any) => (
                        <>
                            {tile.type === "Track" && <Track top={tile.position[0]*30} left={tile.position[1]*30} />}
                            {tile.type === "Platform" && <Platform top={tile.position[0]*30} left={tile.position[1]*30} />}
                         </>
                    ))
                }
                {
                    this.props.model.engines.map((tile: any) => (
                        <>
                            {tile.type === "DieselEngine" && <Engine
                                key={tile.position[1]} 
                                top={tile.position[0]*30}
                                left={tile.position[1]*30}
                                id={tile.id}
                                onClick={this.onEngineClicked}
                            />}
                        </>
                    ))
                }
                {
                    this.props.model.cars.map((tile: any) => (
                        <>
                            {tile.type === "PassengerCar" && <PassengerCar top={tile.position[0]*30} left={tile.position[1]*30} />}
                        </>
                    ))
                }
            </div>
        );
    }

    private onEngineClicked(event:any) {
        this.props.onEngineClicked(event.target.id);
    }

    private onTick() {
        this.props.onTick();
    }
}

export interface ILandProps {
    model:LandModel;
}