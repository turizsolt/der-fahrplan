import { TileModel } from "src/Tiles/TileModel";
import { EngineModel } from 'src/Engine/EngineModel';
import { START_ENGINE, TICK, STOP_ENGINE } from 'src/actions';
import { PassengerCarModel } from 'src/Engine/PassengerCarModel';

export const TILE_SIZE = 30;

const initialState = {
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

export function LandReducer(state=initialState, action:any) {
    switch(action.type) {
        case START_ENGINE:
            return {
                ...state,
                engines: [
                    ...state.engines.filter((engine) => engine.id !== action.params.id),
                    {
                        ...state.engines.find((engine) => engine.id === action.params.id),
                        moving: 1
                    }
                ]
            };

        case STOP_ENGINE:
            return {
                ...state,
                engines: [
                    ...state.engines.filter((engine) => engine.id !== action.params.id),
                    {
                        ...state.engines.find((engine) => engine.id === action.params.id),
                        willStopOnTile: true
                    }
                ]
            };

        case TICK:
            return {
                ...state,
                cars: state.cars.map((car:any) => {
                    const draggerEngine = state.engines.find((engine:any) => engine.id === car.draggedBy);
                    if(draggerEngine && draggerEngine.moving) {
                        return {...car, position: [car.position[0], ++car.position[1]]}
                    } else {
                        return car;
                    }
                }),
                engines: state.engines.map((engine:any) => {
                    if(engine.moving) {
                        if(engine.willStopOnTile && (engine.position[1]%TILE_SIZE === TILE_SIZE-1)) {
                            return {...engine, position: [engine.position[0], ++engine.position[1]], moving: 0, willStopOnTile: false}
                        } else {
                            return {...engine, position: [engine.position[0], ++engine.position[1]]}
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