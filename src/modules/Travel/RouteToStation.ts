import { RouteVariant } from "../../structs/Scheduling/RouteVariant";
import { Station } from "../Station/Station";

export interface RouteToStation {
    route: RouteVariant;
    station: Station;
    time: number;
}

export interface RouteToStationPersisted {
    route: string;
    station: string;
    time: number;
}
