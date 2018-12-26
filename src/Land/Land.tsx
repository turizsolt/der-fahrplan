import * as React from 'react';
import { Engine } from '../Car/Engine/Engine';
import { PassengerCar } from '../Car/PassengerCar/PassengerCar';
import { Platform } from '../Tiles/Platform';
import { Track } from '../Tiles/Track';
import { LandModel } from './LandModel';
import { TileModel } from 'src/Tiles/TileModel';
import { EngineModel } from 'src/Car/Engine/EngineModel';
import { PassengerCarModel } from 'src/Car/PassengerCar/PassengerCarModel';
import { ILandProps } from './LandContainer';
import { End } from 'src/actions';

export class Land extends React.Component<any, {}> {

    public constructor(props:any, state:{}) {
        super(props, state);

        this.onEngineStart = this.onEngineStart.bind(this);
        this.onEngineReverse = this.onEngineReverse.bind(this);
        this.onEngineStop = this.onEngineStop.bind(this);
        this.onTick = this.onTick.bind(this);
        this.onAttachCar = this.onAttachCar.bind(this);
        this.onDetachCar = this.onDetachCar.bind(this);

        setInterval(this.onTick, 100);
    }

    public render() {
        return (
            <div style={{position: "absolute"}}>
                {
                    this.props.model.get("tracks").valueSeq().map((tile: TileModel, index:number) => (
                        <Track key={index} top={tile.position[0]} left={tile.position[1]} />
                    ))
                }
                {
                    this.props.model.get("platforms").valueSeq().map((tile: TileModel, index:number) => (
                        <Platform key={index} top={tile.position[0]} left={tile.position[1]} />
                    ))
                }
                {
                    this.props.model.get("engines").valueSeq().map((engine: EngineModel) => (
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
                    this.props.model.get("cars").valueSeq().map((car: PassengerCarModel) => (
                        <PassengerCar
                            key={car.id} 
                            top={car.position[0]}
                            left={car.position[1]}
                            id={car.id}
                            model={car}
                            onAttach={this.onAttachCar}
                            onDetach={this.onDetachCar}
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

    private onAttachCar(event:React.MouseEvent<HTMLElement>, end:End) {
        this.props.onAttachCar((event.target as HTMLElement).id, end);
    }

    private onDetachCar(event:React.MouseEvent<HTMLElement>, end:End) {
        this.props.onDetachCar((event.target as HTMLElement).id, end);
    }

    private onTick() {
        this.props.onTick();
    }
}

export interface ILandProps {
    model:LandModel;
}