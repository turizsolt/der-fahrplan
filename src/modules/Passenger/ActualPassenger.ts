import { PassengerRenderer } from '../../structs/Renderers/PassengerRenderer';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { TYPES } from '../../di/TYPES';
import { Passenger, Place } from './Passenger';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { injectable, inject } from 'inversify';
import { Station } from '../Station/Station';
import { Color } from '../../structs/Color';
import { Store } from '../../structs/Interfaces/Store';
import { ActualPassengerStatictics } from './ActualPassengerStatistics';
import { Platform } from '../Station/Platform';
import { Train } from '../Train/Train';
import { PassengerRelocator } from './PassengerRelocator';
import { RouteVariant } from '../../structs/Scheduling/RouteVariant';

@injectable()
export class ActualPassenger extends ActualBaseBrick implements Passenger {
    private to: Station;
    private from: Station;
    private next: Station;
    private stats: ActualPassengerStatictics;
    private waitingFor: RouteVariant;

    private place: Place;
    private pos: Coordinate = Coordinate.Origo();

    init(from: Station, to: Station) {
        super.initStore(TYPES.Passenger);
        this.to = to;
        this.from = from;
        this.stats = new ActualPassengerStatictics(this, this.store);

        PassengerRelocator.insideStation(this.store, this, this.from);
        this.renderer.init(this);

        return this;
    }

    getWaitingFor(): RouteVariant {
        return this.waitingFor;
    }

    setWaitingFor(route: RouteVariant): void {
        this.waitingFor = route;
    }

    listenStationAnnouncement(station: Station): void { }

    listenStationArrivingAnnouncement(
        station: Station,
        platform: Platform,
        train: Train,
        trip: RouteVariant
    ) { }

    listenWagonStoppedAtAnnouncement(
        station: Station,
        platform: Platform,
        train: Train,
        route: RouteVariant
    ) { }

    // getters, setters

    getFrom(): Station {
        return this.from;
    }

    getTo(): Station {
        return this.to;
    }

    getNext(): Station {
        return this.next;
    }

    setNext(next: Station) {
        this.next = next;
    }

    getPlace(): Place {
        return this.place;
    }

    getPosition(): Coordinate {
        return this.pos;
    }

    getColor(): Color {
        return this.to.getColor();
    }

    setPlace(place: Place): void {
        if (this.place) {
            this.place.unboard(this);
        }
        this.place = place;
        if (this.place) {
            this.pos = this.place.board(this);
        }
        this.renderer.update();
    }

    justArrived(): void {
        this.stats.setStatsOnArrival();
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
            nextName: this.next && this.next.getName(),
        };
    }

    load(obj: any, store: Store): void {
        this.presetId(obj.id);
        this.init(store.get(obj.from) as Station, store.get(obj.to) as Station);
        this.setPlace(store.get(obj.place) as Place);
    }
}
