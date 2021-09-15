import { Passenger } from "./Passenger";
import { Store } from "../../structs/Interfaces/Store";
import { Station } from "../../structs/Scheduling/Station";
import { TravelPath } from "../Travel/TravelPath";
import { Route } from "../../structs/Scheduling/Route";

export class PassengerRelocator {
    static insideStation(store: Store, passenger: Passenger, station: Station): void {
        const pathes: TravelPath[] = store.getTravelPathes().getPathes(passenger.getFrom(), passenger.getTo());
        const routes: Route[] = pathes.map(p => p.changes[0].route);
        const scheduledDepartures = station.getScheduledTrips();
        passenger.setPlace(station);
        for (let i = 0; i < scheduledDepartures.length; i++) {
            if (routes.includes(scheduledDepartures[i].trip.getRoute())) {
                console.log('will go to ' + passenger.getTo().getName() + ' with', scheduledDepartures[i]);
                return;
            }
        }
        console.log('not sure');
    }
}
