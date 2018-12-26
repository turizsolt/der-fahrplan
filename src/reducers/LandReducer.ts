import { TileModel } from "../Tiles/TileModel";
import { EngineModel } from '../Car/Engine/EngineModel';
import { Action, ActionType } from '../actions';
import { PassengerCarModel } from '../Car/PassengerCar/PassengerCarModel';
import { fromJS } from 'immutable';

export const TILE_SIZE:number = 30;

const initialState = fromJS({
    cars: {
        "car-11": new PassengerCarModel("car-11", 2*TILE_SIZE, 2*TILE_SIZE, null, "car-12"),
        "car-12": new PassengerCarModel("car-12", 2*TILE_SIZE, 4*TILE_SIZE, "car-11", "car-13"),
        "car-13": new PassengerCarModel("car-13", 2*TILE_SIZE, 6*TILE_SIZE, "car-12", "engine-1"),
        "car-21": new PassengerCarModel("car-21", 3*TILE_SIZE, 2*TILE_SIZE, null, null),
    },
    engines: {
        "engine-1": new EngineModel("engine-1", 2*TILE_SIZE, 8*TILE_SIZE, "car-13", null),
        "engine-2": new EngineModel("engine-2", 3*TILE_SIZE, 4*TILE_SIZE, null, null),
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
            return state.updateIn(["engines", action.params.id], (engine:EngineModel) => ({...engine, moving: 1}));

        case ActionType.REVERSE_ENGINE:
            return state.updateIn(["engines", action.params.id], (engine:EngineModel) => ({...engine, moving: -1}));

        case ActionType.STOP_ENGINE:
            return state.updateIn(["engines", action.params.id], (engine:EngineModel) => ({...engine, willStopOnTile: true}));

        case ActionType.TICK:
            let newState = state;
            const keys = newState.get("engines").keySeq().toArray();
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
            keys.map((key:any) => {
                const engine = newState.getIn(["engines", key]);
                if(engine.moving) {
                    const cars = getCars(state, engine.id);
                    cars.map((carId:string) => {
                        newState = newState.updateIn(["cars", carId], (car:PassengerCarModel) => {
                            return {...car, position: [car.position[0], car.position[1]+engine.moving]}
                        });
                    });
                }
            });

            return newState;
        
        case ActionType.DETACH_CAR:
            let detachedState = state;
            
            if(action.params.end === "B") {
                const otherId = detachedState.getIn(["cars", action.params.id]).attachedB;
                detachedState = detachedState.updateIn(["cars", action.params.id], (car:any) => ({...car, attachedB: null}));
                detachedState = detachedState.updateIn(["cars", otherId], (car:any) => ({...car, attachedA: null}));
            } 

            if(action.params.end === "A") {
                const otherId = detachedState.getIn(["cars", action.params.id]).attachedA;
                detachedState = detachedState.updateIn(["cars", action.params.id], (car:any) => ({...car, attachedA: null}));
                detachedState = detachedState.updateIn(["cars", otherId], (car:any) => ({...car, attachedB: null}));
            } 

            return detachedState;

            // TODO what if detached already
            // TODO what if engine *common anchestor*
        
        case ActionType.ATTACH_CAR:   
            let attachedState = state;

            if(action.params.end === "B") {
                const thisCar = attachedState.getIn(["cars", action.params.id]);
                const otherCar = attachedState.get("cars").toArray().find((car:any) => car[1].position[1] === thisCar.position[1]+2*TILE_SIZE)[1];
                if(otherCar) {
                    attachedState = attachedState.updateIn(["cars", thisCar.id], (car:any) => ({...car, attachedB: otherCar.id}));
                    attachedState = attachedState.updateIn(["cars", otherCar.id], (car:any) => ({...car, attachedA: thisCar.id}));
                }
            }

            if(action.params.end === "A") {
                const thisCar = attachedState.getIn(["cars", action.params.id]);
                const otherCar = attachedState.get("cars").toArray().find((car:any) => car[1].position[1] === thisCar.position[1]-2*TILE_SIZE)[1];
                if(otherCar) {
                    attachedState = attachedState.updateIn(["cars", thisCar.id], (car:any) => ({...car, attachedA: otherCar.id}));
                    attachedState = attachedState.updateIn(["cars", otherCar.id], (car:any) => ({...car, attachedB: thisCar.id}));
                }
            }

            return attachedState;

            // TODO also as above

        default:
            return state;
    }
}

function getCars(state: any, engineId: string): string[] {
    const list:string[] = [];

    let car = state.getIn(["engines", engineId]);

    if(car.attachedA) {
        while(car.attachedA) {
            car = state.getIn(["cars", car.attachedA]);
            list.push(car.id);
        }
    } else if (car.attachedB) {
        while(car.attachedB) {
            car = state.getIn(["cars", car.attachedB]);
            list.push(car.id);
        }
    } 

    return list;
}
