import { TYPES } from "../../di/TYPES";
import { getStore } from "../../structs/Actuals/Store/StoreForVue";
import { Route } from "../../structs/Scheduling/Route";
import { Trip } from "../../structs/Scheduling/Trip";


const store = getStore();

export class ScheduleGridComputer {
    static getByRoute(route: Route, adderTripId: string): any {
        const stops = route.getStops().map(s =>
        ({
            name: s.getWaypoint()?.getName(),
            time: s.getTimeToStation(),
            extraTime: s.getExtraTimeToStation(),
            stopId: s.getId()
        })
        );
        const times = stops.slice(1);
        const rowCount = stops.length * 2 + 12;

        const trips = store.getAllOf<Trip>(TYPES.Trip)
            .filter(t => t.getRoute() === route);
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
                    name: prev.getRoute().getName(),
                    color: prev.getRoute().getColor(),
                    timeStr: prev.getArrivalTimeStr()
                }
            });
            timetable.push({ actions: { tripId: trip.getId() } });
            timetable.push({ sign: { name: route.getName(), color: route.getColor() } });
            timetable.push(...trip.getWaypoints().filter(w => w.shouldStop).map(w => ({ timeStr: w.departureTime ? w.departureTimeString : w.arrivalTimeString })));
            timetable.push({
                hasNext: !!next, next: !next ? {} : {
                    name: next.getRoute().getName(),
                    color: next.getRoute().getColor(),
                    timeStr: next.getDepartureTimeStr()
                }
            });

            lastTrip = trip;
        }
        timetable.push({ inter: { prevTime: lastTrip?.getDepartureTime() } });

        return { stops, times, rowCount, timetable };
    }
}
