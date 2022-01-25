import { TYPES } from "../../di/TYPES";
import { getStore } from "../../structs/Actuals/Store/StoreForVue";
import { RouteVariant } from "../../structs/Scheduling/RouteVariant";
import { Trip } from "../../structs/Scheduling/Trip";
import { Util } from "../../structs/Util";


const store = getStore();

export class ScheduleGridComputer {
    static getByRoute(route: RouteVariant, adderTripId: string): any {
        const stops = route.getStops().map(s =>
        ({
            name: s.getRef()?.getName(),
            time: 0, //s.getTimeToStation(),
            extraTime: 0, //s.getExtraTimeToStation(),
            stopId: '' //s.getId()
        })
        );
        const times = stops.slice(1);
        const rowCount = stops.length * 2 + 12;

        const trips = store.getAllOf<Trip>(TYPES.Trip)
            .filter(t => t.getRouteVariant() === route);
        trips.sort((a, b) => a.getDepartureTime() - b.getDepartureTime());

        const timetable = [];
        let lastTrip: Trip = null;
        for (let trip of trips) { // .filter(w => w.isStation)
            if (trip.getId() === adderTripId) {
                timetable.push({
                    adder: {
                        prevTime: lastTrip?.getDepartureTime(),
                        nextTime: trip?.getDepartureTime()
                    }
                });
            }

            const prev = trip.getPrevTrip();
            const next = trip.getNextTrip();
            timetable.push({
                hasPrev: !!prev, prev: !prev ? {} : {
                    name: prev.getRouteVariant().getName(),
                    color: prev.getRouteVariant().getColor(),
                    timeStr: 0, //prev.getArrivalTimeStr()
                }
            });
            timetable.push({ actions: { tripId: trip.getId() } });
            timetable.push({ sign: { name: route.getName(), color: route.getColor() } });
            timetable.push(...trip.getWaypoints().filter(w => w.shouldStop).map(w => ({ timeStr: w.departureTime ? Util.timeToString(w.departureTime) : Util.timeToString(w.arrivalTime) })));
            timetable.push({
                hasNext: !!next, next: !next ? {} : {
                    name: next.getRouteVariant().getName(),
                    color: next.getRouteVariant().getColor(),
                    timeStr: 0, //next.getDepartureTimeStr()
                }
            });

            lastTrip = trip;
        }
        timetable.push({ inter: { prevTime: lastTrip?.getDepartureTime() } });

        return { stops, times, rowCount, timetable };
    }
}
