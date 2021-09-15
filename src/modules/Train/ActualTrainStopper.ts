import { Platform } from "../../structs/Interfaces/Platform";
import { Store } from "../../structs/Interfaces/Store";
import { Util } from "../../structs/Util";
import { SightMarker } from "./Sight/SightMarker";
import { Train } from "./Train";

export class ActualTrainStopper {
    private stoppedAt: Platform = null;
    private ready: boolean = true;
    private minimumStayingTime: number = 0;

    private shouldTurn: boolean = false;
    private shouldStop: boolean = false;

    constructor(private train: Train, private store: Store) { }

    tick(marker: SightMarker): void {
        if (!this.stoppedAt && marker?.type === 'Platform') {
            this.stoppedAt = marker.object as Platform;
            this.ready = false;
            this.minimumStayingTime = 30;
            console.log('stopped at', marker.object.getId());
            this.startStopping();
        }

        if (this.stoppedAt && !this.ready) {
            console.log('stopping', this.minimumStayingTime);
            this.minimumStayingTime--;
            if (this.minimumStayingTime < 0 && this.isTimeToGo()) {
                this.ready = true;
            }
        }

        if (this.stoppedAt && this.ready) {
            console.log('ready');
            this.endStopping();
            this.stoppedAt = null;
        }
    }

    canDepart(): boolean {
        return this.ready;
    }

    private isTimeToGo(): boolean {
        if (this.train.getTrips().length === 0) return true;
        const depTime: number = this.train.getTrips()[0].getStationDepartureTime(this.stoppedAt.getStation());
        return !depTime || depTime <= this.store.getTickCount();
    }

    private startStopping(): void {
        this.shouldTurn = false;
        this.shouldStop = false;
        if (this.stoppedAt.getStation()) {
            this.train.getTrips().map(t => t.setStationServed(this.stoppedAt.getStation()));
        }
        this.train.getWagons()[0].stop();

        // reverse at the end of the trip, and also get the next trip
        const lastStop = this.train.getTrips().length > 0 ? Util.last(this.train.getTrips()[0].getWaypoints()) : null;
        if (lastStop && lastStop.station === this.stoppedAt.getStation()) {
            this.arrivedToLastStation();
        }

        // reverse if needed to
        const thisStop = this.train.getTrips().length > 0 ? this.train.getTrips()[0].getRoute().getStops().find(x => x.getStation() === this.stoppedAt.getStation()) : null;
        if (thisStop) {
            if (thisStop.isReverseStop()) {
                this.shouldTurn = true;
                this.shouldStop = false;
            }
        }
    }

    private arrivedToLastStation() {
        const newTrip = this.train.getTrips().length > 0 ? this.train.getTrips()[0].getNextTrip() : null;
        if (newTrip) {
            this.shouldTurn = this.train.getTrips()[0].getNextReverse();
            this.train.assignTrip(null);
            this.train.assignTrip(newTrip);
            this.shouldStop = false;
        } else {
            this.shouldStop = true;
        }
    }

    private endStopping(): void {
        if (this.stoppedAt.getStation()) {
            this.train.getTrips().map(t => t.setAtStation(null));
        }
        this.train.getWagons()[0].stop();
        if (this.shouldTurn) {
            this.train.reverse();
        }
        if (this.shouldStop) {
            this.train.setAutoMode(false);
        }
    }
}
