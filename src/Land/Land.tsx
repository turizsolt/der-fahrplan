import * as React from 'react';
import { Engine } from '../Car/Engine/Engine';
import { PassengerCar } from '../Car/PassengerCar/PassengerCar';
import { Platform } from '../Tiles/Platform/Platform';
import { Track } from '../Tiles/Track/Track';
import { LandModel } from './LandModel';
import { TileModel } from 'src/Tiles/TileModel';
import { EngineModel } from 'src/Car/Engine/EngineModel';
import { ILandProps } from './LandContainer';
import { End } from 'src/actions';
import { CarModel } from 'src/Car/CarModel';
import { TrackS } from 'src/Tiles/Track/TrackS';
import { SwitchRight } from 'src/Tiles/Track/SwitchRight';
import { SwitchModelRight } from 'src/Tiles/Track/SwitchModelRight';
import { SwitchModelLeft } from 'src/Tiles/Track/SwitchModelLeft';
import { SwitchLeft } from 'src/Tiles/Track/SwitchLeft';

export class Land extends React.Component<any, {}> {

    public constructor(props:any, state:{}) {
        super(props, state);

        this.onEngineStart = this.onEngineStart.bind(this);
        this.onEngineReverse = this.onEngineReverse.bind(this);
        this.onEngineStop = this.onEngineStop.bind(this);
        this.onTick = this.onTick.bind(this);
        this.onSwitch = this.onSwitch.bind(this);
        this.onAttachCar = this.onAttachCar.bind(this);
        this.onDetachCar = this.onDetachCar.bind(this);

        setInterval(this.onTick, 100);
    }

    public render() {
        return (
            <div style={{position: "absolute"}}>
                {
                    this.props.model.get("tracks").valueSeq().map((tile: TileModel, index:number) => {
                        if(tile.type === "TrackS") {
                            return <TrackS key={index} model={tile} />;
                        } else if(tile.type === "Track") {
                            return <Track key={index} model={tile} />;
                        } else if(tile.type === "SwitchRight") {
                            const switc = tile as SwitchModelRight;
                            return <SwitchRight key={index} model={switc} onSwitch={this.onSwitch} />;
                        } else if(tile.type === "SwitchLeft") {
                            const switc = tile as SwitchModelLeft;
                            return <SwitchLeft key={index} model={switc} onSwitch={this.onSwitch} />;
                        } else {
                            return null;
                        }
                    })
                }
                {
                    this.props.model.get("platforms").valueSeq().map((tile: TileModel, index:number) => (
                        <Platform key={index} model={tile} />
                    ))
                }
                {
                    this.props.model.get("cars").valueSeq().map((car: CarModel) => {
                        if(car.type === "PassengerCar") {
                            return (<PassengerCar
                                key={car.id} 
                                model={car}
                                onAttach={this.onAttachCar}
                                onDetach={this.onDetachCar}
                            />);
                        } else if (car.type === "DieselEngine") {
                            const engine = car as EngineModel;
                            return (<Engine
                                key={engine.id} 
                                model={engine}
                                onAttach={this.onAttachCar}
                                onDetach={this.onDetachCar}
                                onStart={this.onEngineStart}
                                onReverse={this.onEngineReverse}
                                onStop={this.onEngineStop}
                            />);
                        } else {
                            return null;
                        }
                    })
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

    private onSwitch(event:React.MouseEvent<HTMLElement>) {
        this.props.onSwitch((event.target as HTMLElement).id);
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