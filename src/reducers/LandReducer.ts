import { TileModel } from "../Tiles/TileModel";
import { EngineModel } from '../Car/Engine/EngineModel';
import { Action, ActionType } from '../actions';
import { PassengerCarModel } from '../Car/PassengerCar/PassengerCarModel';
import { fromJS } from 'immutable';
import { Coordinate } from 'src/Geometry/Coordinate';
import { Rectangle } from 'src/Geometry/Rectangle';
import { TrackModel } from 'src/Tiles/Track/TrackModel';
import { CarModel } from 'src/Car/CarModel';
import { SwitchModelRight } from 'src/Tiles/Track/SwitchModelRight';
import { SwitchModelLeft } from 'src/Tiles/Track/SwitchModelLeft';

export const TILE_SIZE:number = 30;

const initialState = fromJS({
    cars: {
        "car-11": new PassengerCarModel("car-11", new Coordinate(2.5*TILE_SIZE, 5*TILE_SIZE), new Rectangle(2*TILE_SIZE, 4*TILE_SIZE, 3*TILE_SIZE, 6*TILE_SIZE), "engine-1", "car-12", "track-11", 90),
        "car-12": new PassengerCarModel("car-12", new Coordinate(2.5*TILE_SIZE, 7*TILE_SIZE), new Rectangle(2*TILE_SIZE, 6*TILE_SIZE, 3*TILE_SIZE, 8*TILE_SIZE), "car-11", "car-13", "track-11", 150),
        "car-13": new PassengerCarModel("car-13", new Coordinate(2.5*TILE_SIZE, 9*TILE_SIZE), new Rectangle(2*TILE_SIZE, 8*TILE_SIZE, 3*TILE_SIZE, 10*TILE_SIZE), "car-12", null, "track-11", 210),
        "car-21": new PassengerCarModel("car-21", new Coordinate(3.5*TILE_SIZE, 3*TILE_SIZE), new Rectangle(3*TILE_SIZE, 2*TILE_SIZE, 4*TILE_SIZE, 4*TILE_SIZE), null, null, "track-2", 30),

        "engine-1": new EngineModel("engine-1", new Coordinate(2.5*TILE_SIZE, 3*TILE_SIZE), new Rectangle(2*TILE_SIZE, 2*TILE_SIZE, 3*TILE_SIZE, 4*TILE_SIZE), null, "car-11", "track-11", 30),
        "engine-2": new EngineModel("engine-2", new Coordinate(3.5*TILE_SIZE, 5*TILE_SIZE), new Rectangle(3*TILE_SIZE, 4*TILE_SIZE, 4*TILE_SIZE, 6*TILE_SIZE), null, null, "track-2", 90),
    },
    platforms: [
        new TileModel("Platform", new Coordinate(1.5*TILE_SIZE, 5*TILE_SIZE), new Rectangle(1*TILE_SIZE, 2*TILE_SIZE, 2*TILE_SIZE, 8*TILE_SIZE)),
        new TileModel("Platform", new Coordinate(4.5*TILE_SIZE, 5*TILE_SIZE), new Rectangle(4*TILE_SIZE, 2*TILE_SIZE, 5*TILE_SIZE, 8*TILE_SIZE)),
    ],
    tracks: {
        "track-11": new TrackModel("Track", "track-11", new Coordinate(2.5*TILE_SIZE, 7*TILE_SIZE), new Rectangle(2*TILE_SIZE, 2*TILE_SIZE, 3*TILE_SIZE, 12*TILE_SIZE), 300, null, "track-12"),
        "track-12": new SwitchModelRight("SwitchRight", "track-12", new Coordinate(2.5*TILE_SIZE, 11.5*TILE_SIZE), new Rectangle(1*TILE_SIZE, 12*TILE_SIZE, 3*TILE_SIZE, 15*TILE_SIZE), 90, "track-11","track-14", "track-13"),
        "track-13": new TrackModel("Track", "track-13", new Coordinate(1.5*TILE_SIZE, 20*TILE_SIZE), new Rectangle(1*TILE_SIZE, 15*TILE_SIZE, 2*TILE_SIZE, 25*TILE_SIZE), 300, "track-12", "track-15"),
        "track-14": new TrackModel("Track", "track-14", new Coordinate(2.5*TILE_SIZE, 20*TILE_SIZE), new Rectangle(2*TILE_SIZE, 15*TILE_SIZE, 3*TILE_SIZE, 25*TILE_SIZE), 300, "track-12", "track-15"),
        "track-15": new SwitchModelLeft("SwitchLeft", "track-15", new Coordinate(2.5*TILE_SIZE, 26.5*TILE_SIZE), new Rectangle(1*TILE_SIZE, 25*TILE_SIZE, 3*TILE_SIZE, 28*TILE_SIZE), 90, "track-14","track-16", "track-13"),
        "track-16": new TrackModel("Track", "track-16", new Coordinate(2.5*TILE_SIZE, 32*TILE_SIZE), new Rectangle(2*TILE_SIZE, 28*TILE_SIZE, 3*TILE_SIZE, 36*TILE_SIZE), 240, "track-15", null),
        "track-2": new TrackModel("Track", "track-2", new Coordinate(3.5*TILE_SIZE, 12*TILE_SIZE), new Rectangle(3*TILE_SIZE, 2*TILE_SIZE, 4*TILE_SIZE, 22*TILE_SIZE), 600, null, null),
    },    
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
                        let track:TrackModel = state.getIn(["tracks", engine.trackId]);
                        let sleeper:number = engine.sleeper+engine.moving; 

                        if(sleeper < 0) {
                            if(track.attachedA) {
                                track = state.getIn(["tracks", track.attachedA]);
                                sleeper = sleeper + track.sleeperCount;
                            } else {
                                sleeper = engine.sleeper-engine.moving;
                                return EngineModel.moveToAndStop(engine, track, sleeper);
                            }
                        }

                        if(sleeper > track.sleeperCount) {
                            if(track.attachedB) {
                                sleeper = sleeper - track.sleeperCount;
                                track = state.getIn(["tracks", track.attachedB]);
                            } else {
                                sleeper = engine.sleeper-engine.moving;
                                return EngineModel.moveToAndStop(engine, track, sleeper);
                            }
                        }

                        if(engine.willStopOnTile && sleeper%TILE_SIZE === 0) {
                            return EngineModel.moveToAndStop(engine, track, sleeper);
                        } else {
                            return EngineModel.moveTo(engine, track, sleeper);
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
                            let track:TrackModel = state.getIn(["tracks", car.trackId]);
                            let sleeper:number = car.sleeper+engine.moving; 

                            // TODO copy-paste suspition ahead
                            if(sleeper < 0) {
                                if(track.attachedA) {
                                    track = state.getIn(["tracks", track.attachedA]);
                                    sleeper = sleeper + track.sleeperCount;
                                } else {
                                    return car;
                                }
                            }
    
                            if(sleeper > track.sleeperCount) {
                                if(track.attachedB) {
                                    sleeper = sleeper - track.sleeperCount;
                                    track = state.getIn(["tracks", track.attachedB]);
                                } else {
                                    return car;
                                }
                            }

                            return CarModel.moveTo(car, track, sleeper);
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

        case ActionType.TRACK_SWITCH:
            const sw = state.getIn(["tracks", action.params.id]);
            if(sw.type === "SwitchRight") {
                return state.updateIn(["tracks", action.params.id], (track:SwitchModelRight) => SwitchModelRight.doSwitch(track));
            } else if(sw.type === "SwitchLeft") {
                return state.updateIn(["tracks", action.params.id], (track:SwitchModelLeft) => SwitchModelLeft.doSwitch(track));
            } else {
                return state;
            }

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
