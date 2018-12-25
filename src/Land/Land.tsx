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
        this.onEngineDoubleClicked = this.onEngineDoubleClicked.bind(this);
        this.onTick = this.onTick.bind(this);

        setInterval(this.onTick, 100);
    }

    public render() {
        return (
            <div style={{position: "absolute"}}>
                {
                    this.props.model.tracks.map((tile: any, index:any) => (
                        <Track key={index} top={tile.position[0]} left={tile.position[1]} />
                    ))
                }
                {
                    this.props.model.platforms.map((tile: any, index:any) => (
                        <Platform key={index} top={tile.position[0]} left={tile.position[1]} />
                    ))
                }
                {
                    this.props.model.engines.map((tile: any) => (
                        <Engine
                            key={tile.id} 
                            top={tile.position[0]}
                            left={tile.position[1]}
                            id={tile.id}
                            onClick={this.onEngineClicked}
                            onDoubleClick={this.onEngineDoubleClicked}
                        />
                    ))
                }
                {
                    this.props.model.cars.map((tile: any) => (
                        <PassengerCar
                            key={tile.id} 
                            top={tile.position[0]}
                            left={tile.position[1]}
                            id={tile.id}
                        />
                    ))
                }
            </div>
        );
    }

    private onEngineClicked(event:any) {
        this.props.onEngineClicked(event.target.id);
    }

    private onEngineDoubleClicked(event:any) {
        this.props.onEngineDoubleClicked(event.target.id);
    }

    private onTick() {
        this.props.onTick();
    }
}

export interface ILandProps {
    model:LandModel;
}