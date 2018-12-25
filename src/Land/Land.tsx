import * as React from 'react';
import { Engine } from '../Engine/Engine';
import { PassengerCar } from '../Tiles/PassengerCar';
import { Platform } from '../Tiles/Platform';
import { Track } from '../Tiles/Track';
import { LandModel } from './LandModel';
import { TileModel } from 'src/Tiles/TileModel';
import { EngineModel } from 'src/Engine/EngineModel';
import { PassengerCarModel } from 'src/Engine/PassengerCarModel';
import { ILandProps } from './LandContainer';

export class Land extends React.Component<ILandProps, {}> {

    public constructor(props:ILandProps, state:{}) {
        super(props, state);

        this.onEngineStart = this.onEngineStart.bind(this);
        this.onEngineReverse = this.onEngineReverse.bind(this);
        this.onEngineStop = this.onEngineStop.bind(this);
        this.onTick = this.onTick.bind(this);

        setInterval(this.onTick, 100);
    }

    public render() {
        return (
            <div style={{position: "absolute"}}>
                {
                    this.props.model.tracks.map((tile: TileModel, index:number) => (
                        <Track key={index} top={tile.position[0]} left={tile.position[1]} />
                    ))
                }
                {
                    this.props.model.platforms.map((tile: TileModel, index:number) => (
                        <Platform key={index} top={tile.position[0]} left={tile.position[1]} />
                    ))
                }
                {
                    this.props.model.engines.map((engine: EngineModel) => (
                        <Engine
                            key={engine.id} 
                            top={engine.position[0]}
                            left={engine.position[1]}
                            moving={engine.moving}
                            willStop={engine.willStopOnTile}
                            id={engine.id}
                            onStart={this.onEngineStart}
                            onReverse={this.onEngineReverse}
                            onStop={this.onEngineStop}
                        />
                    ))
                }
                {
                    this.props.model.cars.map((car: PassengerCarModel) => (
                        <PassengerCar
                            key={car.id} 
                            top={car.position[0]}
                            left={car.position[1]}
                            id={car.id}
                        />
                    ))
                }
            </div>
        );
    }

    private onEngineStart(event:React.MouseEvent<HTMLElement>) {
        this.props.onEngineStart((event.target as HTMLElement).id);
    }

    private onEngineReverse(event:React.MouseEvent<HTMLElement>) {
        this.props.onEngineReverse((event.target as HTMLElement).id);
    }

    private onEngineStop(event:React.MouseEvent<HTMLElement>) {
        this.props.onEngineStop((event.target as HTMLElement).id);
    }

    private onTick() {
        this.props.onTick();
    }
}

export interface ILandProps {
    model:LandModel;
}