// action types

export enum ActionType {
    START_ENGINE = "START_ENGINE",
    REVERSE_ENGINE = "REVERSE_ENGINE",
    STOP_ENGINE = "STOP_ENGINE",
    TICK = "TICK",
    ATTACH_CAR = "ATTACH_CAR",
    DETACH_CAR = "DETACH_CAR",
    TRACK_SWITCH = "TRACK_SWITCH",
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

export function trackSwitch(id:string):Action<IParamsId> {
    return {type: ActionType.TRACK_SWITCH, params: {id}};
}

export function tick():Action<{}> {
    return {type: ActionType.TICK};
}

export function attachCar(id:string, end:End):Action<IParamsIdEnd> {
    return {type: ActionType.ATTACH_CAR, params: {id, end}};
}

export function detachCar(id:string, end:End):Action<IParamsIdEnd> {
    return {type: ActionType.DETACH_CAR, params: {id, end}};
}

// action creators typing

export class Action<ParamsType> {
    public type: ActionType;
    public params?: ParamsType;
}

export interface IParamsId {
    id:string;
}

export interface IParamsIdEnd {
    id:string;
    end:End;
}

export type End = "A"|"B";
