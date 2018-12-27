import { TileModel } from "../Tiles/TileModel";
import { EngineModel } from '../Car/Engine/EngineModel';
import { Action, ActionType } from '../actions';
import { PassengerCarModel } from '../Car/PassengerCar/PassengerCarModel';
import { fromJS } from 'immutable';
import { Coordinate } from 'src/Coordinate';
import { Rectangle } from 'src/Rectangle';

export const TILE_SIZE:number = 30;

const initialState = fromJS({
    cars: {
        "car-11": new PassengerCarModel("car-11", new Coordinate(2.5*TILE_SIZE, 3*TILE_SIZE), new Rectangle(2*TILE_SIZE, 2*TILE_SIZE, 3*TILE_SIZE, 4*TILE_SIZE), null, "car-12"),
        "car-12": new PassengerCarModel("car-12", new Coordinate(2.5*TILE_SIZE, 5*TILE_SIZE), new Rectangle(2*TILE_SIZE, 4*TILE_SIZE, 3*TILE_SIZE, 6*TILE_SIZE), "car-11", "car-13"),
        "car-13": new PassengerCarModel("car-13", new Coordinate(2.5*TILE_SIZE, 7*TILE_SIZE), new Rectangle(2*TILE_SIZE, 6*TILE_SIZE, 3*TILE_SIZE, 8*TILE_SIZE), "car-12", "engine-1"),
        "car-21": new PassengerCarModel("car-21", new Coordinate(3.5*TILE_SIZE, 3*TILE_SIZE), new Rectangle(3*TILE_SIZE, 2*TILE_SIZE, 4*TILE_SIZE, 4*TILE_SIZE), null, null),
        "engine-1": new EngineModel("engine-1", new Coordinate(2.5*TILE_SIZE, 9*TILE_SIZE), new Rectangle(2*TILE_SIZE, 8*TILE_SIZE, 3*TILE_SIZE, 10*TILE_SIZE), "car-13", null),
        "engine-2": new EngineModel("engine-2", new Coordinate(3.5*TILE_SIZE, 5*TILE_SIZE), new Rectangle(3*TILE_SIZE, 4*TILE_SIZE, 4*TILE_SIZE, 6*TILE_SIZE), null, null),
    },
    platforms: [
        new TileModel("Platform", new Coordinate(1.5*TILE_SIZE, 5*TILE_SIZE), new Rectangle(1*TILE_SIZE, 2*TILE_SIZE, 2*TILE_SIZE, 8*TILE_SIZE)),
        new TileModel("Platform", new Coordinate(4.5*TILE_SIZE, 5*TILE_SIZE), new Rectangle(4*TILE_SIZE, 2*TILE_SIZE, 5*TILE_SIZE, 8*TILE_SIZE)),
    ],
    tracks: [
        new TileModel("Track", new Coordinate(2.5*TILE_SIZE, 12*TILE_SIZE), new Rectangle(2*TILE_SIZE, 2*TILE_SIZE, 3*TILE_SIZE, 22*TILE_SIZE)),
        new TileModel("Track", new Coordinate(3.5*TILE_SIZE, 12*TILE_SIZE), new Rectangle(3*TILE_SIZE, 2*TILE_SIZE, 4*TILE_SIZE, 22*TILE_SIZE)),
    ],    
});

export function LandReducer(state=initialState, action:Action<any>) {
    switch(action.type) {
        case ActionType.START_ENGINE:
            return state.updateIn(["cars", action.params.id], (engine:EngineModel) => ({...engine, moving: 1}));

        case ActionType.REVERSE_ENGINE:
            return state.updateIn(["cars", action.params.id], (engine:EngineModel) => ({...engine, moving: -1}));

        case ActionType.STOP_ENGINE:
            return state.updateIn(["cars", action.params.id], (engine:EngineModel) => ({...engine, willStopOnTile: true}));

        case ActionType.TICK:
            let newState = state;
            const keys = newState.get("cars").keySeq().toArray();
            keys.map((key:any) => {
                const car = newState.getIn(["cars", key]);
                if(car.type !== "DieselEngine") { return; }

                newState = newState.updateIn(["cars", key], (engine:EngineModel) => {
                    if(engine.moving) {
                        if(engine.willStopOnTile && ((engine.center.x+engine.moving)%TILE_SIZE === 0)) {
                            return {...engine, center: {y: engine.center.y, x: engine.center.x+engine.moving}, box: new Rectangle(engine.box.top, engine.box.left+engine.moving, engine.box.bottom, engine.box.right+engine.moving), moving: 0, willStopOnTile: false}
                        } else {
                            return {...engine, center: {y: engine.center.y, x: engine.center.x+engine.moving}, box: new Rectangle(engine.box.top, engine.box.left+engine.moving, engine.box.bottom, engine.box.right+engine.moving)}
                        }
                    } else {
                        return engine;
                    }
                });
            });
            keys.map((key:any) => {
                const engine = state.getIn(["cars", key]);
                if(engine.moving) {
                    const cars = getCars(state, engine.id);
                    cars.map((carId:string) => {
                        newState = newState.updateIn(["cars", carId], (car:PassengerCarModel) => {
                            return {...car, center: {y: car.center.y, x:car.center.x+engine.moving}, box: new Rectangle(car.box.top, car.box.left+engine.moving, car.box.bottom, car.box.right+engine.moving)}
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
        
        case ActionType.ATTACH_CAR:   
            let attachedState = state;

            if(action.params.end === "B") {
                const thisCar = attachedState.getIn(["cars", action.params.id]);
                const otherCarObj = attachedState.get("cars").toArray().find((car:any) => car[1].center.x === thisCar.center.x+2*TILE_SIZE && car[1].center.y === thisCar.center.y);
                if(otherCarObj) {
                    const otherCar = otherCarObj[1];
                    attachedState = attachedState.updateIn(["cars", thisCar.id], (car:any) => ({...car, attachedB: otherCar.id}));
                    attachedState = attachedState.updateIn(["cars", otherCar.id], (car:any) => ({...car, attachedA: thisCar.id}));
                }
            }

            if(action.params.end === "A") {
                const thisCar = attachedState.getIn(["cars", action.params.id]);
                const otherCarObj = attachedState.get("cars").toArray().find((car:any) => car[1].center.x === thisCar.center.x-2*TILE_SIZE && car[1].center.y === thisCar.center.y);
                if(otherCarObj) {
                    const otherCar = otherCarObj[1];
                    attachedState = attachedState.updateIn(["cars", thisCar.id], (car:any) => ({...car, attachedA: otherCar.id}));
                    attachedState = attachedState.updateIn(["cars", otherCar.id], (car:any) => ({...car, attachedB: thisCar.id}));
                }
            }

            return attachedState;

        default:
            return state;
    }
}

function getCars(state: any, engineId: string): string[] {
    const list:string[] = [];

    let car = state.getIn(["cars", engineId]);

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
