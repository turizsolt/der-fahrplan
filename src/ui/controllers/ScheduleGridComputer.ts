import { TYPES } from "../../di/TYPES";
import { getStore } from "../../structs/Actuals/Store/StoreForVue";
import { Route } from "../../structs/Scheduling/Route";
import { Trip } from "../../structs/Scheduling/Trip";


const store = getStore();

export class ScheduleGridComputer {
    static getByRoute(route: Route):any {
        const stops = route.getStops().map(s => 
            ({
                name: s.getStation()?.getName(), 
                time: s.getDepartureTime()
            })
        );
        const times = stops.slice(1);
        const rowCount = stops.length;

        const trips = store.getAllOf<Trip>(TYPES.Trip)
            .filter(t => t.getRoute() === route);
        trips.sort((a,b) => a.getDepartureTime() - b.getDepartureTime());

        const timetable = [];
        for(let trip of trips) {
            timetable.push(...trip.getWaypoints().filter(w => w.isStation).map(w => ({timeStr: w.departureTimeString})));
        }
        timetable.push({inter: true});

        return {stops, times, rowCount, timetable};
    }
}
