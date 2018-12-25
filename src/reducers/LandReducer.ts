import { TileModel } from "src/Tiles/TileModel";
import { EngineModel } from 'src/Engine/EngineModel';
import { START_ENGINE, TICK } from 'src/actions';
import { PassengerCarModel } from 'src/Engine/PassengerCarModel';

const engine1 = new EngineModel("DieselEngine", "engine-1", 2, 6);
const initialState = {
    cars: [
        new PassengerCarModel("PassengerCar", "engine-1", 2, 2),
        new PassengerCarModel("PassengerCar", "engine-1", 2, 4),
    ],
    engines: [
        engine1
    ],
    tileList: [
        new TileModel("Track", 2, 2),
        new TileModel("Track", 2, 4),
        new TileModel("Track", 2, 6),
        new TileModel("Track", 2, 8),
        new TileModel("Track", 2, 10),
        new TileModel("Track", 2, 12),
        new TileModel("Track", 2, 14),
        new TileModel("Track", 2, 16),
        new TileModel("Track", 2, 18),
        new TileModel("Track", 2, 20),

        new TileModel("Platform", 1, 2),
        new TileModel("Platform", 1, 4),
        new TileModel("Platform", 1, 6),
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
                        return {...engine, position: [engine.position[0], ++engine.position[1]]}
                    } else {
                        return engine;
                    }
                }),
            };

        default:
            return state;
    }
}