import { Platform } from '../../structs/Interfaces/Platform';
import { PassengerRenderer } from '../../structs/Renderers/PassengerRenderer';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { TYPES } from '../../di/TYPES';
import { Passenger, Place } from './Passenger';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { injectable, inject } from 'inversify';
import { Station } from '../../structs/Scheduling/Station';
import { Route } from '../../structs/Scheduling/Route';
import { Color } from '../../structs/Color';
import { Store } from '../../structs/Interfaces/Store';
import { RouteStop } from '../../structs/Scheduling/RouteStop';
import { Train } from '../Train/Train';

@injectable()
export class ActualPassenger extends ActualBaseBrick implements Passenger {
    private to: Station;
    private from: Station;
    private nextStation: Station;

    private place: Place;
    private pos: Coordinate = Coordinate.Origo();

    private startTime: number = -1;
    private endTime: number = -1;
    private travelTime: number = -1;
    private travelDistance: number = -1;

    init(from: Station, to: Station) {
        super.initStore(TYPES.Passenger);
        this.to = to;
        this.from = from;

        this.renderer.init(this);
        this.setPath();
        this.listenStationAnnouncement(this.from);

        this.startTime = this.store.getTickCount();
        return this;
    }

    justArrived(): void {
        this.endTime = this.store.getTickCount();
        this.travelTime = this.endTime - this.startTime;
        this.travelDistance = this.from.getCircle().a.distance2d(this.to.getCircle().a);
        this.store.addArrivedPassengerStats({ time: this.travelTime, distance: this.travelDistance });
    }

    // called from outside, announcements

    listenStationAnnouncement(station: Station): void {
        // todo (reason: it has to be commented, so not clear) moving to the platform, if necessary
        const nextPlace: Place = station.getPlatformTo(this.to) || station;
        if (nextPlace !== this.place) {
            this.setPlace(nextPlace);
            this.renderer.update();
        }

        this.setPath();
    }

    listenStationArrivingAnnouncement(
        station: Station,
        platform: Platform,
        train: Train,
        trip: Route
    ) {
        if (!trip) return;

        const stationIndex = trip
            .getStops()
            .findIndex(s => s.getStation() === station);
        const toIndex = trip.getStops().findIndex((s, ind) => ind > stationIndex && s.getStation() === this.nextStation);

        // todo redo everything

        if (toIndex !== -1 && stationIndex !== -1 && stationIndex < toIndex) {
            const wagon = train.getFreeWagon();
            if (wagon) {
                this.setPlace(wagon);
                this.renderer.update();
            }
        }
    }

    listenWagonStoppedAtAnnouncement(
        station: Station,
        platform: Platform,
        train: Train,
        route: Route
    ) {
        if (this.isStationInPath(station)) {
            if (this.isStationFinal(station)) {
                this.setPlace(null);
                this.renderer.update();
                this.justArrived();
            } else {
                // this.setNextOnPath();
                this.setPlace(station);
                this.renderer.update();
            }
        } else if (!route) {
            this.setPlace(station);
            this.renderer.update();
        } else if (!this.isNextStationInTheTrip(route)) {
            this.setPlace(station);
            this.renderer.update();
        }
    }

    // private helpers

    private setPath() {
        this.nextStation = this.to;
    }

    private isStationInPath(station: Station): boolean {
        return this.nextStation === station;
    }

    private isStationFinal(station: Station): boolean {
        return this.to === station;
    }

    private isNextStationInTheTrip(route: Route): boolean {
        return route
            .getStops()
            .map((x: RouteStop) => x.getStation())
            .includes(this.nextStation);
    }

    // getters, setters

    getPlace(): Place {
        return this.place;
    }

    getPosition(): Coordinate {
        return this.pos;
    }

    getColor(): Color {
        return this.to.getColor();
    }

    private setPlace(place: Place) {
        if (this.place) {
            this.place.unboard(this);
        }
        this.place = place;
        if (this.place) {
            this.pos = this.place.board(this);
            this.renderer.update();
        }
    }

    updatePos(pos: Coordinate): void {
        this.pos = pos;
        this.renderer.update();
    }

    // todo should remove and use eventing
    @inject(TYPES.PassengerRenderer) private renderer: PassengerRenderer;

    getRenderer(): BaseRenderer {
        return this.renderer;
    }

    isRemovable(): boolean {
        return false;
    }

    // persistance

    persist(): Object {
        return {
            id: this.getId(),
            type: 'Passenger',

            from: this.from.getId(),
            to: this.to.getId(),

            place: this.place?.getId()
        };
    }

    persistDeep(): Object {
        return {
            id: this.getId(),
            type: 'Passenger',

            fromName: this.from.getName(),
            toName: this.to.getName(),
            nextName: this.nextStation && this.nextStation.getName(),
        };
    }

    load(obj: any, store: Store): void {
        this.presetId(obj.id);
        this.init(store.get(obj.from) as Station, store.get(obj.to) as Station);
        this.setPlace(store.get(obj.place) as Place);
    }
}
