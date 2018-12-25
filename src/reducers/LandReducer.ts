import { TileModel } from "src/Tiles/TileModel";
import { EngineModel } from 'src/Engine/EngineModel';
import { Action, ActionType } from 'src/actions';
import { PassengerCarModel } from 'src/Engine/PassengerCarModel';
import { LandModel } from 'src/Land/LandModel';

export const TILE_SIZE:number = 30;

const initialState:LandModel = {
    cars: [
        new PassengerCarModel("car-11", "engine-1", 2*TILE_SIZE, 2*TILE_SIZE),
        new PassengerCarModel("car-12", "engine-1", 2*TILE_SIZE, 4*TILE_SIZE),
        new PassengerCarModel("car-21", "engine-2", 3*TILE_SIZE, 2*TILE_SIZE),
    ],
    engines: [
        new EngineModel("engine-1", 2*TILE_SIZE, 6*TILE_SIZE),
        new EngineModel("engine-2", 3*TILE_SIZE, 4*TILE_SIZE),
    ],
    platforms: [
        new TileModel("Platform", 1*TILE_SIZE, 2*TILE_SIZE),
        new TileModel("Platform", 1*TILE_SIZE, 4*TILE_SIZE),
        new TileModel("Platform", 1*TILE_SIZE, 6*TILE_SIZE),

        new TileModel("Platform", 4*TILE_SIZE, 2*TILE_SIZE),
        new TileModel("Platform", 4*TILE_SIZE, 4*TILE_SIZE),
        new TileModel("Platform", 4*TILE_SIZE, 6*TILE_SIZE),
    ],
    tracks: [
        new TileModel("Track", 2*TILE_SIZE, 2*TILE_SIZE),
        new TileModel("Track", 2*TILE_SIZE, 4*TILE_SIZE),
        new TileModel("Track", 2*TILE_SIZE, 6*TILE_SIZE),
        new TileModel("Track", 2*TILE_SIZE, 8*TILE_SIZE),
        new TileModel("Track", 2*TILE_SIZE, 10*TILE_SIZE),
        new TileModel("Track", 2*TILE_SIZE, 12*TILE_SIZE),
        new TileModel("Track", 2*TILE_SIZE, 14*TILE_SIZE),
        new TileModel("Track", 2*TILE_SIZE, 16*TILE_SIZE),
        new TileModel("Track", 2*TILE_SIZE, 18*TILE_SIZE),
        new TileModel("Track", 2*TILE_SIZE, 20*TILE_SIZE),

        new TileModel("Track", 3*TILE_SIZE, 2*TILE_SIZE),
        new TileModel("Track", 3*TILE_SIZE, 4*TILE_SIZE),
        new TileModel("Track", 3*TILE_SIZE, 6*TILE_SIZE),
        new TileModel("Track", 3*TILE_SIZE, 8*TILE_SIZE),
        new TileModel("Track", 3*TILE_SIZE, 10*TILE_SIZE),
        new TileModel("Track", 3*TILE_SIZE, 12*TILE_SIZE),
        new TileModel("Track", 3*TILE_SIZE, 14*TILE_SIZE),
        new TileModel("Track", 3*TILE_SIZE, 16*TILE_SIZE),
        new TileModel("Track", 3*TILE_SIZE, 18*TILE_SIZE),
        new TileModel("Track", 3*TILE_SIZE, 20*TILE_SIZE),
    ],    
};

export function LandReducer(state:LandModel=initialState, action:Action<any>) {
    switch(action.type) {
        case ActionType.START_ENGINE:
            return {
                ...state,
                engines: [
                    ...state.engines.filter((engine:EngineModel) => engine.id !== action.params.id),
                    {
                        ...state.engines.find((engine:EngineModel) => engine.id === action.params.id),
                        moving: 1
                    }
                ]
            };

        case ActionType.REVERSE_ENGINE:
            return {
                ...state,
                engines: [
                    ...state.engines.filter((engine:EngineModel) => engine.id !== action.params.id),
                    {
                        ...state.engines.find((engine:EngineModel) => engine.id === action.params.id),
                        moving: -1
                    }
                ]
            };    

        case ActionType.STOP_ENGINE:
            return {
                ...state,
                engines: [
                    ...state.engines.filter((engine:EngineModel) => engine.id !== action.params.id),
                    {
                        ...state.engines.find((engine:EngineModel) => engine.id === action.params.id),
                        willStopOnTile: true
                    }
                ]
            };

        case ActionType.TICK:
            return {
                ...state,
                cars: state.cars.map((car:PassengerCarModel) => {
                    const draggerEngine = state.engines.find((engine:EngineModel) => engine.id === car.draggedBy);
                    if(draggerEngine && draggerEngine.moving) {
                        return {...car, position: [car.position[0], car.position[1]+draggerEngine.moving]}
                    } else {
                        return car;
                    }
                }),
                engines: state.engines.map((engine:EngineModel) => {
                    if(engine.moving) {
                        if(engine.willStopOnTile && ((engine.position[1]+engine.moving)%TILE_SIZE === 0)) {
                            return {...engine, position: [engine.position[0], engine.position[1]+engine.moving], moving: 0, willStopOnTile: false}
                        } else {
                            return {...engine, position: [engine.position[0], engine.position[1]+engine.moving]}
                        }
                    } else {
                        return engine;
                    }
                }),
            };

        default:
            return state;
    }
}