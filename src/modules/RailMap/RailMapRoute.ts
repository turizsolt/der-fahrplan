import { Ray } from "../../structs/Geometry/Ray";
import { RoutePart } from "../../structs/Scheduling/RoutePart";

export interface RailMapRoute {
    from: Ray,
    to: Ray,
    fromOriginal: Ray,
    toOriginal: Ray,
    fromId: string,
    toId: string,
    fromObj: RoutePart,
    toObj: RoutePart

    no: number,
    count: number,
    hash: string,
    color: string,
    routeId: string,
    opposite: boolean
};

export interface RailMapRouteDraw {
    from: Ray,
    to: Ray,
    color: string,
    routeId: string
};

export interface RailMapStop {
    point: Ray,
    color: string,
    routeId: string,
    stopping: boolean
}

export type RailMapRouteArray = RailMapRoute[];
