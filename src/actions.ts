// action types

export const START_ENGINE = "START_ENGINE";
export const STOP_ENGINE = "STOP_ENGINE";
export const TICK = "TICK";

// action creators

export function startEngine(id:string) {
    return {type: START_ENGINE, params: {id}};
}

export function stopEngine(id:string) {
    return {type: STOP_ENGINE, params: {id}};
}

export function tick() {
    return {type: TICK};
}
