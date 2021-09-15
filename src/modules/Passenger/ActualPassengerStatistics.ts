import { Store } from "../../structs/Interfaces/Store";
import { Passenger } from "./Passenger";

export class ActualPassengerStatictics {
    private startTime: number = -1;
    private endTime: number = -1;
    private travelTime: number = -1;
    private travelDistance: number = -1;

    constructor(private passenger: Passenger, private store: Store) {
        this.startTime = this.store.getTickCount();
    }

    setStatsOnArrival(): void {
        this.endTime = this.store.getTickCount();
        this.travelTime = this.endTime - this.startTime;
        this.travelDistance = this.passenger.getFrom().getCircle().a.distance2d(this.passenger.getTo().getCircle().a);
        this.store.addArrivedPassengerStats({ time: this.travelTime, distance: this.travelDistance });
    }
}
