import { Passenger } from "./Passenger";
import { Store } from "../../structs/Interfaces/Store";
import { Station } from "../Station/Station";
import { TravelPath } from "../Travel/TravelPath";
import { Route } from "../../structs/Scheduling/Route";
import { AbstractPlatform } from "../Station/AbstractPlatform";

export class PassengerRelocator {
    static insideStation(store: Store, passenger: Passenger, station: Station): void {
        const pathes: TravelPath[] = store.getTravelPathes().getPathes(station, passenger.getTo());
        const routes: Route[] = pathes.map(p => p.changes[0].route);
        const waitingHalls = station.getWaitingHalls();
        const platforms = station.getPlatforms();
        const scheduledDepartures = station.getScheduledTrips();
        for (let i = 0; i < scheduledDepartures.length; i++) {
            if (scheduledDepartures[i].gone) continue;
            const index = routes.findIndex(x => x === scheduledDepartures[i].trip.getRoute());
            if (index !== -1) {
                const trip = scheduledDepartures[i].trip;
                const route = trip.getRoute();
                passenger.setWaitingFor(route);
                passenger.setNext(pathes[index].changes[0].station);

                const stop = trip.getWaypoints().find(s => s.isStation && s.station === station);
                const platform = stop?.platform;

                if (platform) {
                    passenger.setPlace(platform);
                } else {
                    if (waitingHalls.length > 0) {
                        passenger.setPlace(waitingHalls[Math.random() * waitingHalls.length | 0]);
                    } else if (platforms.length > 0) {
                        passenger.setPlace(platforms[Math.random() * platforms.length | 0]);
                    } else {
                        passenger.setPlace(station);
                    }
                }
                return;
            }
        }
        passenger.setWaitingFor(null);
        passenger.setNext(null);

        if (waitingHalls.length > 0) {
            passenger.setPlace(waitingHalls[Math.random() * waitingHalls.length | 0]);
        } else if (platforms.length > 0) {
            passenger.setPlace(platforms[Math.random() * platforms.length | 0]);
        } else {
            passenger.setPlace(station);
        }

    }

    static changedPlatform(store: Store, passenger: Passenger, newPlatform: AbstractPlatform): void {
        passenger.setPlace(newPlatform);
    }
}
