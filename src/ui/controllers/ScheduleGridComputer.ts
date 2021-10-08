import { TYPES } from "../../di/TYPES";
import { getStore } from "../../structs/Actuals/Store/StoreForVue";
import { Route } from "../../structs/Scheduling/Route";
import { Trip } from "../../structs/Scheduling/Trip";


const store = getStore();

export class ScheduleGridComputer {
    static getByRoute(route: Route):any {
        const stops = route.getWaypoints().map(s => 
            ({
                name: s.getStation()?.getName(), 
                time: s.getTimeToStation(),
                extraTime: s.getExtraTimeToStation(),
                stopId: s.getId()
            })
        );
        const times = stops.slice(1);
        const rowCount = stops.length;

        const trips = store.getAllOf<Trip>(TYPES.Trip)
            .filter(t => t.getRoute() === route);
        trips.sort((a,b) => a.getDepartureTime() - b.getDepartureTime());

        const timetable = [];
        for(let trip of trips) { // .filter(w => w.isStation)
            timetable.push(...trip.getWaypoints().map(w => ({timeStr: w.departureTime ? w.departureTimeString : w.arrivalTimeString})));
        }
        timetable.push({inter: true});

        return {stops, times, rowCount, timetable};
    }
}
