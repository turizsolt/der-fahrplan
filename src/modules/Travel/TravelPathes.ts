import { TYPES } from "../../di/TYPES";
import { Store } from "../../structs/Interfaces/Store";
import { Route } from "../../structs/Scheduling/Route";
import { RouteStop } from "../../structs/Scheduling/RouteStop";
import { Station } from "../Station/Station";
import { Util } from "../../structs/Util";
import { TravelPath } from "./TravelPath";

export class TravelPathes {
    private pathes: Record<string, Record<string, TravelPath[]>> = {};
    private stations: Station[] = [];
    private routes: Route[] = [];

    constructor(private store: Store) { }

    getPathes(from: Station, to: Station): TravelPath[] {
        return this.pathes[from.getId()]?.[to.getId()] ?? [];
    }

    find(level: number = 1): void {
        this.initialiseRoutes();
        this.initialiseStations();
        this.initialisePathes();

        this.findDirect();
        this.orderPathesByScore();
        this.cutDownTheSlowOnes();

        for (let i = 1; i < level; i++) {
            this.findWithTransfer();
            this.orderPathesByScore();
            this.cutDownTheSlowOnes();
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
                if (Util.last(f.changes).route === Util.first(s.changes).route) continue; // todo what if skipping a loop on the same line?
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
                this.pathes[from.getId()][to.getId()] = this.skipTheSameSecondTime(this.pathes[from.getId()][to.getId()]);
            }
        }
    }

    private orderByScore(tp: TravelPath[]): void {
        tp.sort((a: TravelPath, b: TravelPath) => {
            if (a.score > b.score) return 1;
            if (a.score < b.score) return -1;

            if (a.changes.length > b.changes.length) return 1;
            if (a.changes.length < b.changes.length) return -1;

            for (let i = 0; i < a.changes.length; i++) {
                if (a.changes[i].time > b.changes[i].time) return 1;
                if (a.changes[i].time < b.changes[i].time) return -1;

                if (a.changes[i].route.getId() > b.changes[i].route.getId()) return 1;
                if (a.changes[i].route.getId() < b.changes[i].route.getId()) return -1;

                if (a.changes[i].station.getId() > b.changes[i].station.getId()) return 1;
                if (a.changes[i].station.getId() < b.changes[i].station.getId()) return -1;
            }
            return 0;
        });
    }

    private skipTheSameSecondTime(tp: TravelPath[]): TravelPath[] {
        if (tp.length === 0) return [];

        const result: TravelPath[] = [tp[0]];

        let last: TravelPath = tp[0];
        for (let i = 1; i < tp.length; i++) {
            if (!this.isSamePath(last, tp[i])) {
                last = tp[i];
                result.push(tp[i]);
            }
        }

        return result;
    }

    private isSamePath(a: TravelPath, b: TravelPath): boolean {
        if (a.score !== b.score) return false;
        if (a.changes.length !== b.changes.length) return false;

        for (let i = 0; i < a.changes.length; i++) {
            if (a.changes[i].time !== b.changes[i].time) return false;
            if (a.changes[i].route !== b.changes[i].route) return false;
            if (a.changes[i].station !== b.changes[i].station) return false;
        }

        return true;
    }

    private cutDownTheSlowOnes(): void {
        for (let from of this.stations) {
            for (let to of this.stations) {
                if (this.pathes[from.getId()][to.getId()].length === 0) continue;

                const targetScore = this.pathes[from.getId()][to.getId()][0].score;
                const targetChanges = this.pathes[from.getId()][to.getId()][0].changes.length;

                this.pathes[from.getId()][to.getId()] = this.pathes[from.getId()][to.getId()].filter(x => x.score <= (targetScore * 1.5) || x.changes.length < targetChanges);
            }
        }
    }
}
