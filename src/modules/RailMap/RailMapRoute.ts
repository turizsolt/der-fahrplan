import { Ray } from "../../structs/Geometry/Ray";

export interface RailMapRoute {
    from: Ray,
    to: Ray,
    fromOriginal: Ray,
    toOriginal: Ray,
    fromId: string,
    toId: string,

    no: number,
    count: number,
    hash: string,
    color: string,
    routeId: string
};

export interface RailMapRouteDraw {
    from: Ray,
    to: Ray,
    color: string,
    routeId: string
};

export type RailMapRouteArray = RailMapRoute[];
