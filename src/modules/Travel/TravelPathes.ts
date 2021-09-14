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

    find(level: number = 1): void {
        this.initialiseRoutes();
        this.initialiseStations();
        this.initialisePathes();

        this.findDirect();
        this.orderPathesByScore();

        for (let i = 1; i < level; i++) {
            this.findWithTransfer();
            this.orderPathesByScore();
        }
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

    private copyPathes(): Record<string, Record<string, TravelPath[]>> {
        const result: Record<string, Record<string, TravelPath[]>> = {};
        for (let from of this.stations) {
            result[from.getId()] = {};
            for (let to of this.stations) {
                result[from.getId()][to.getId()] = [...this.pathes[from.getId()][to.getId()]];
            }
        }
        return result;
    }

    private composePathes(first: TravelPath[], second: TravelPath[]): TravelPath[] {
        const result: TravelPath[] = [];

        for (let f of first) {
            for (let s of second) {
                result.push({ score: f.score + s.score, changes: [...f.changes, ...s.changes] });
            }
        }

        return result;
    }

    private findWithTransfer(): void {
        const prevPathes = this.copyPathes();

        for (let from of this.stations) {
            for (let to of this.stations) {
                if (from === to) continue;
                for (let intermediate of this.stations) {
                    if (from === intermediate) continue;
                    if (to === intermediate) continue;

                    const newPathes: TravelPath[] = this.composePathes(
                        prevPathes[from.getId()][intermediate.getId()],
                        prevPathes[intermediate.getId()][to.getId()]
                    );

                    this.pathes[from.getId()][to.getId()].push(...newPathes);
                }
            }
        }
    }

    private orderPathesByScore(): void {
        for (let from of this.stations) {
            for (let to of this.stations) {
                this.orderByScore(this.pathes[from.getId()][to.getId()]);
            }
        }
    }

    private orderByScore(tp: TravelPath[]): void {
        tp.sort((a: TravelPath, b: TravelPath) => a.score - b.score);
    }
}
