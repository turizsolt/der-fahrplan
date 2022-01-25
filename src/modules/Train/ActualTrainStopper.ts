import { Platform } from "../Station/Platform";
import { Store } from "../../structs/Interfaces/Store";
import { Passenger } from "../Passenger/Passenger";
import { PassengerRelocator } from "../Passenger/PassengerRelocator";
import { SightMarker } from "./Sight/SightMarker";
import { Train } from "./Train";
import { Station } from "../Station/Station";

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
            this.startStopping();
        }

        if (this.stoppedAt && !this.ready) {
            this.minimumStayingTime--;
            this.stopping();
            if (this.minimumStayingTime < 0 && this.isTimeToGo()) {
                this.ready = true;
            }
        }

        if (this.stoppedAt && this.ready) {
            this.endStopping();
            this.stoppedAt = null;
        }
    }

    canDepart(): boolean {
        return this.ready;
    }

    private stopping(): void {
        // const trainers: Passenger[] = this.train.getWagons()
        //     .map(w => w.getBoardedPassengers()).flat();

        // todo leszallas

        const offboarders: Passenger[] = this.train.getWagons()
            .map(w => w.getBoardedPassengers()).flat()
            .filter(p => p.getNext() === this.stoppedAt.getStation());

        offboarders.map(b => {
            if (b.getTo() === this.stoppedAt.getStation()) {
                b.setPlace(null);
                b.justArrived();
            } else {
                PassengerRelocator.insideStation(this.store, b, this.stoppedAt.getStation());
            }
        });

        // todo felszallas

        const onboarders: Passenger[] = this.stoppedAt //.getStation()
            .getBoardedPassengers()
            .filter(p => p.getWaitingFor() === this.train.getTrips()[0].getRouteVariant());

        onboarders.map(b => {
            const wagon = this.train.getFreeWagon();
            if (wagon) {
                b.setPlace(wagon);
            }
        });
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
            this.train.getTrips().map(t => t.arrive(this.stoppedAt.getStation()));
            // this.train.getTrips().map(t => t.setStationServed(this.stoppedAt.getStation()));
        }
        this.train.getWagons()[0].stop();

        // reverse at the end of the trip, and also get the next trip
        if (this.train.getTrips()?.[0]?.isAtLastStation()) {
            this.arrivedToLastStation();
        }

        // reverse if needed to
        const thisStop = this.train.getTrips().length > 0 ? this.train.getTrips()[0].getWaypoints().find(x => x.station === this.stoppedAt.getStation()) : null;
        if (thisStop) {
            if (thisStop.isReverseStop) {
                this.shouldTurn = true;
                this.shouldStop = false;
            }
        }
    }

    private arrivedToLastStation() {
        const station: Station = this.stoppedAt?.getStation();
        if (station) {
            station.setTripAsGone(this.train.getTrips()[0]);
        }

        this.train.resetNextPlatform();

        const newTrip = this.train.getTrips().length > 0 ? this.train.getTrips()[0].getNextTrip() : null;
        if (newTrip) {
            this.shouldTurn = this.train.getTrips()[0].getNextReverse();
            this.train.assignTrip(null);
            this.train.assignTrip(newTrip);
            this.shouldStop = false;

            if (this.stoppedAt.getStation()) {
                this.train.getTrips().map(t => t.start());
                // this.train.getTrips().map(t => t.setStationServed(this.stoppedAt.getStation()));
            }
        } else {
            this.shouldStop = true;
        }
    }

    private endStopping(): void {
        if (this.stoppedAt.getStation()) {
            this.train.getTrips().map(t => t.depart());
            // this.train.getTrips().map(t => t.setStationServed(this.stoppedAt.getStation()));
            this.stoppedAt.getStation().setTripAsGone(this.train.getTrips()[0]);
            // this.train.getTrips().map(t => t.setAtStation(null));
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
