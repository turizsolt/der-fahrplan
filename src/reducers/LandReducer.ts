import { TileModel } from "src/Tiles/TileModel";
import { EngineModel } from 'src/Engine/EngineModel';
import { Action, ActionType } from 'src/actions';
import { PassengerCarModel } from 'src/Engine/PassengerCarModel';
import { fromJS } from 'immutable';

export const TILE_SIZE:number = 30;

declare var global:any;

const initialState = fromJS({
    cars: {
        "car-11": new PassengerCarModel("car-11", "engine-1", 2*TILE_SIZE, 2*TILE_SIZE, null, "car-12"),
        "car-12": new PassengerCarModel("car-12", "engine-1", 2*TILE_SIZE, 4*TILE_SIZE, "car-11", "engine-1"),
        "car-21": new PassengerCarModel("car-21", "engine-2", 3*TILE_SIZE, 2*TILE_SIZE, null, null),
    },
    engines: {
        "engine-1": new EngineModel("engine-1", 2*TILE_SIZE, 6*TILE_SIZE, "car-12", null, "car-11"),
        "engine-2": new EngineModel("engine-2", 3*TILE_SIZE, 4*TILE_SIZE, null, null, "engine-2"),
    },
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
});

export function LandReducer(state=initialState, action:Action<any>) {
    switch(action.type) {
        case ActionType.START_ENGINE:
            global.y = state;
            return state.updateIn(["engines", action.params.id], (engine:EngineModel) => ({...engine, moving: 1}));

        case ActionType.REVERSE_ENGINE:
            return state.updateIn(["engines", action.params.id], (engine:EngineModel) => ({...engine, moving: -1}));

        case ActionType.STOP_ENGINE:
            return state.updateIn(["engines", action.params.id], (engine:EngineModel) => ({...engine, willStopOnTile: true}));

        case ActionType.TICK:
            let newState = state;
            let keys = newState.get("engines").keySeq().toArray();
            keys.map((key:any) => {
                newState = newState.updateIn(["engines", key], (engine:EngineModel) => {
                    if(engine.moving) {
                        if(engine.willStopOnTile && ((engine.position[1]+engine.moving)%TILE_SIZE === 0)) {
                            return {...engine, position: [engine.position[0], engine.position[1]+engine.moving], moving: 0, willStopOnTile: false}
                        } else {
                            return {...engine, position: [engine.position[0], engine.position[1]+engine.moving]}
                        }
                    } else {
                        return engine;
                    }
                });
            });

            keys = newState.get("cars").keySeq().toArray();
            keys.map((key:any) => {
                newState = newState.updateIn(["cars", key], (car:PassengerCarModel) => {
                    const draggerEngine = state.getIn(["engines", car.draggedBy]);
                    if(draggerEngine && draggerEngine.moving) {
                        return {...car, position: [car.position[0], car.position[1]+draggerEngine.moving]}
                    } else {
                        return car;
                    }
                });
            });
            return newState;
        
        /*
        case ActionType.ATTACH_CAR:
        case ActionType.DETACH_CAR:
            console.log(action);
            return {
                ...state,
                cars: state.cars.map((car:PassengerCarModel) => {
                    if(car.id === action.params.id) {
                        return {...car, attachedA: null, attachedB: null}
                    } else {
                        return car;
                    }
                }),
            };*/

        default:
            return state;
    }
}