import { Ray } from "../../structs/Geometry/Ray";

export type RailMapRoute = { from: Ray, to: Ray, no: number, count: number, hash: string, color: string, routeId: string }[];
