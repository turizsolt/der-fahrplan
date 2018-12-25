// action types

export enum ActionType {
    START_ENGINE = "START_ENGINE",
    REVERSE_ENGINE = "REVERSE_ENGINE",
    STOP_ENGINE = "STOP_ENGINE",
    TICK = "TICK"
}

// action creators

export function startEngine(id:string):Action<IParamsId> {
    return {type: ActionType.START_ENGINE, params: {id}};
}

export function reverseEngine(id:string):Action<IParamsId> {
    return {type: ActionType.REVERSE_ENGINE, params: {id}};
}

export function stopEngine(id:string):Action<IParamsId> {
    return {type: ActionType.STOP_ENGINE, params: {id}};
}

export function tick():Action<{}> {
    return {type: ActionType.TICK};
}

// action creators typing

export class Action<ParamsType> {
    public type: ActionType;
    public params?: ParamsType;
}

export interface IParamsId {
    id:string;
}
