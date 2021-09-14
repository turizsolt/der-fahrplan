import { RouteToStation, RouteToStationPersisted } from "./RouteToStation";

export interface TravelPath {
    score: number;
    changes: RouteToStation[];
}

export interface TravelPathPersisted {
    score: number;
    changes: RouteToStationPersisted[];
}

export const persistTravelPathes = (tp: TravelPath[]): TravelPathPersisted[] => {
    return tp.map(t => ({
        score: t.score,
        changes: t.changes.map(c => ({ time: c.time, route: c.route.getId(), station: c.station.getId() }))
    }));
}

export const persistReadableTravelPathes = (tp: TravelPath[]): string[] => {
    return tp.map(t => (t.score.toString() + ': ' + t.changes.map(c => (c.route.getName() + '>' + c.station.getName() + ' (' + c.time.toString() + ')')).join(' ')));
}
