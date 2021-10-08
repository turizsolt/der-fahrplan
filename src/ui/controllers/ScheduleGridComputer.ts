import { TYPES } from "../../di/TYPES";
import { getStore } from "../../structs/Actuals/Store/StoreForVue";
import { Route } from "../../structs/Scheduling/Route";
import { Trip } from "../../structs/Scheduling/Trip";


const store = getStore();

export class ScheduleGridComputer {
    static getByRoute(route: Route):any {
        const stops = route.getWaypoints().map(s => 
            ({
                name: s.getWaypoint()?.getName(), 
                time: s.getTimeToStation(),
                extraTime: s.getExtraTimeToStation(),
                stopId: s.getId()
            })
        );
        const times = stops.slice(1);
        const rowCount = stops.length * 2 + 10;

        const trips = store.getAllOf<Trip>(TYPES.Trip)
            .filter(t => t.getRoute() === route);
        trips.sort((a,b) => a.getDepartureTime() - b.getDepartureTime());

        const timetable = [];
        for(let trip of trips) { // .filter(w => w.isStation)
            const prev = trip.getPrevTrip();
            const next = trip.getNextTrip();
            timetable.push({hasPrev: !!prev, prev: !prev ? {} : {
                name: prev.getRoute().getName(), 
                color: prev.getRoute().getColor(), 
                timeStr: prev.getArrivalTimeStr()
            }});
            timetable.push({sign: {name: route.getName(), color: route.getColor()}});
            timetable.push(...trip.getWaypoints().map(w => ({timeStr: w.departureTime ? w.departureTimeString : w.arrivalTimeString})));
            timetable.push({hasNext: !!next, next: !next ? {} : {
                name: next.getRoute().getName(), 
                color: next.getRoute().getColor(), 
                timeStr: next.getDepartureTimeStr()
            }});
        }
        timetable.push({inter: true});
        
        return {stops, times, rowCount, timetable};
    }
}
