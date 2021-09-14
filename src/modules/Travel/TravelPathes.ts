import { TYPES } from "../../di/TYPES";
import { Store } from "../../structs/Interfaces/Store";
import { Route } from "../../structs/Scheduling/Route";
import { RouteStop } from "../../structs/Scheduling/RouteStop";
import { Station } from "../../structs/Scheduling/Station";
import { TravelPath } from "./TravelPath";

export class TravelPathes {
    private pathes: Record<string, Record<string, TravelPath[]>> = {};
    private stations: Station[] = [];
    private routes: Route[] = [];

    constructor(private store: Store) { }

    getPathes(from: Station, to: Station): TravelPath[] {
        return this.pathes[from.getId()]?.[to.getId()];
    }

    find(): void {
        this.initialiseRoutes();
        this.initialiseStations();
        this.initialisePathes();

        this.findDirect();
    }

    private initialiseRoutes(): void {
        this.routes = this.store.getAllOf<Route>(TYPES.Route);
    }

    private initialiseStations(): void {
        this.stations = this.store.getAllOf<Station>(TYPES.Station);
    }

    private initialisePathes(): void {
        this.pathes = {};
        for (let from of this.stations) {
            this.pathes[from.getId()] = {};
            for (let to of this.stations) {
                this.pathes[from.getId()][to.getId()] = [];
            }
        }
    }

    private findDirect(): void {
        for (let route of this.routes) {
            const stops: RouteStop[] = route.getStops();
            for (let i = 0; i < stops.length; i++) {
                for (let j = i + 1; j < stops.length; j++) {
                    const from: Station = stops[i].getStation();
                    const to: Station = stops[j].getStation();
                    const dist: number = stops[j].getArrivalTime() - stops[i].getDepartureTime();
                    this.pathes[from.getId()][to.getId()].push({ score: dist, changes: [{ route, station: to, time: dist }] });
                }
            }
        }
    }
}
