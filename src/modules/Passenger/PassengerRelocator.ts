import { Passenger } from "./Passenger";
import { Store } from "../../structs/Interfaces/Store";
import { Station } from "../Station/Station";
import { TravelPath } from "../Travel/TravelPath";
import { Route } from "../../structs/Scheduling/Route";

export class PassengerRelocator {
    static insideStation(store: Store, passenger: Passenger, station: Station): void {
        const pathes: TravelPath[] = store.getTravelPathes().getPathes(station, passenger.getTo());
        const routes: Route[] = pathes.map(p => p.changes[0].route);
        const waitingHalls = station.getWaitingHalls();
        const platforms = station.getPlatforms();
        const scheduledDepartures = station.getScheduledTrips();
        for (let i = 0; i < scheduledDepartures.length; i++) {
            if (scheduledDepartures[i].departureTime < store.getTickCount()) continue;
            const index = routes.findIndex(x => x === scheduledDepartures[i].trip.getRoute());
            if (index !== -1) {
                const route = scheduledDepartures[i].trip.getRoute();
                passenger.setWaitingFor(route);
                passenger.setNext(pathes[index].changes[0].station);

                const platform = route.getStops().find(s => s.getStation() === station)?.getPlatform();
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
}
