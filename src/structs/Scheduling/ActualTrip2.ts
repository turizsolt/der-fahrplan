import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Route } from './Route';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Trip } from './Trip';
import { TripStop, OptionalTripStop } from './TripStop';
import { RouteStop } from './RouteStop';
import { Platform } from '../../modules/Station/Platform';
import { Station } from '../../modules/Station/Station';
import { Util } from '../Util';
import { Trip2 } from './Trip2';
import { RouteVariant } from './RouteVariant';
import { RoutePart } from './RoutePart';
import { RoutePartReference } from './RoutePartReference';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';

export class ActualTrip2 extends ActualBaseStorable implements Trip2 {
    private routeVariant: RouteVariant;
    private departureTime: number;
    private routePartAt: RoutePart;
    private redefinedProps: Record<string, OptionalTripStop> = {};

    private prevTrip: Trip2 = null;
    private nextTrip: Trip2 = null;
    private nextReverse: boolean = true;

    init(routeVariant: RouteVariant, departureTime: number): Trip2 {
        super.initStore(TYPES.Trip);
        this.routeVariant = routeVariant;
        this.departureTime = departureTime;

        return this;
    }

    getNextTrip(): Trip2 {
        return this.nextTrip;
    }

    setNextTrip(trip: Trip2): void {
        this.nextTrip = trip;
    }

    getPrevTrip(): Trip2 {
        return this.prevTrip;
    }

    setPrevTrip(trip: Trip2): void {
        this.prevTrip = trip;
    }

    getNextReverse(): boolean {
        return this.nextReverse;
    }

    toggleNextReverse(): void {
        this.nextReverse = !this.nextReverse;
    }

    getDepartureTime(): number {
        return this.departureTime;
    }

    setDepartureTime(time: number): void {
        this.departureTime = time;
    }

    redefine(stop: RoutePartReference, props: OptionalTripStop): void {
        const id = (stop as RailMapNode).getId();
        this.redefinedProps[id] = {
            ...this.redefinedProps[id],
            ...props
        };
    }

    undefine(stop: RoutePartReference, props: OptionalTripStop): void {
        const id = (stop as RailMapNode).getId();
        for (let prop of Object.keys(props)) {
            if (this.redefinedProps[id]?.[prop]) {
                delete this.redefinedProps[id][prop];
            }
        }
    }

    start(): void {
        this.routePartAt = this.routeVariant.getFirstStop();
    }

    arrive(ref: RoutePartReference): boolean {
        this.routePartAt = this.routePartAt.getNext(this.routeVariant.getStartEnd());
        this.redefine(this.routePartAt.getRef(), { realArrivalTime: this.store.getTickCount() });

        return this.routePartAt.getRef() === ref;
    }

    depart(): void {
        this.routePartAt = this.routePartAt.getNext(this.routeVariant.getStartEnd());
        this.redefine(this.routePartAt.getRef(), { realDepartureTime: this.store.getTickCount() });
    }

    skip(ref: RoutePartReference): boolean {
        const ret = this.arrive(ref);
        this.depart();

        return ret;
    }

    // todo returning the stops to show on the side

    getWaypoints(): TripStop[] {
        const stops = this.routeVariant.getWaypoints();
        const index = stops.findIndex((s: RoutePart) => s === this.routePartAt);
        return stops.map((stop, ind) => {
            const sto: TripStop = {
                trip: null,
                route: null,
                routeStop: null,
                id: this.id,

                station: stop.getRef() as Station,
                stationRgbColor: (stop.getRef() as Station).getColor().getRgbString(),
                stationName: stop.getRef().getName(),
                platform: null,
                platformNo: '',
                hasArrivalTime: false,
                hasDepartureTime: false,
                arrivalTime: 0,
                departureTime: 0,
                realArrivalTime: 0,
                realDepartureTime: 0,
                arrivalTimeString: '',
                departureTimeString: '',
                realArrivalTimeString: '',
                realDepartureTimeString: '',
                isServed: (ind <= index),
                atStation: (ind === index) && (this.routePartAt === stop),
                isArrivalStation: ind === stops.length - 1,
                isDepartureStation: ind === 0,
                shouldStop: true,
                isStation: true
            };

            return sto;
        });
    };

    persist(): Object {
        throw new Error('Method not implemented.');
    }

    load(obj: Object, store: Store): void {
        throw new Error('Method not implemented.');
    }
}
