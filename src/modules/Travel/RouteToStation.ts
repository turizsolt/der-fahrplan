import { Route } from "../../structs/Scheduling/Route";
import { Station } from "../../structs/Scheduling/Station";

export interface RouteToStation {
    route: Route;
    station: Station;
    time: number;
}

export interface RouteToStationPersisted {
    route: string;
    station: string;
    time: number;
}
