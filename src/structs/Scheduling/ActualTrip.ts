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
import { RoutePart } from './RoutePart';
import { RoutePartReference } from './RoutePartReference';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { RouteVariant } from './RouteVariant';
import { BaseStorable } from '../Interfaces/BaseStorable';

export class ActualTrip extends ActualBaseStorable implements Trip {
    private routeVariant: RouteVariant;
    private departureTime: number;
    private routePartAt: RoutePart;
    private redefinedProps: Record<string, OptionalTripStop> = {};

    private prevTrip: Trip = null;
    private nextTrip: Trip = null;
    private nextReverse: boolean = true;

    init(routeVariant: RouteVariant, departureTime: number): Trip {
        super.initStore(TYPES.Trip);
        this.routeVariant = routeVariant;
        this.departureTime = departureTime;

        return this;
    }

    getRouteVariant(): RouteVariant {
        return this.routeVariant;
    }

    getNextTrip(): Trip {
        return this.nextTrip;
    }

    setNextTrip(trip: Trip): void {
        this.nextTrip = trip;
    }

    getPrevTrip(): Trip {
        return this.prevTrip;
    }

    setPrevTrip(trip: Trip): void {
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

    updatePlatformInfo(routePart: RoutePart, props: OptionalTripStop): void {
        this.redefine(routePart.getRef(), props);
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

    getStationDepartureTime(station: Station): number {
        const list = this.routeVariant.getStops().filter(stop => stop.getRef() === station);
        if (list.length === 0) return null;
        const stop = list[0];

        let addedTime = 0;
        const stops = this.routeVariant.getStops();
        for (let i = 0; i < stops.length; i++) {
            addedTime += stops[i].getDuration();

            if (stop === stops[i]) break;
        }

        return this.departureTime + addedTime; //(this.redefinedProps[(stop.getRef() as RailMapNode).getId()]?.departureTime) ??
    }

    // todo only stopping stations should count
    getNextStation(): Station {
        let iter = this.routePartAt;
        while (iter) {
            if (iter.getType() === TYPES.RoutePartStop) {
                return iter.getRef() as Station;
            }
            iter = iter.getNext(this.routeVariant.getStartEnd());
        }

        return null;
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

    /*
    private route: Route = null;
    private departureTime: number;
    private redefinedProps: Record<string, OptionalTripStop> = {};
    private lastStationServed: Station = null;
    private atStation: Station = null;

    private prevTrip: Trip = null;
    private nextTrip: Trip = null;
    private nextReverse: boolean = true;
    private hasGroup: boolean = false;

    init(route: Route, departureTime: number, hasGroup: boolean = false): Trip {
        super.initStore(TYPES.Trip);
        this.route = route;
        this.departureTime = departureTime;
        this.hasGroup = hasGroup;

        const stationsInvolved = this.route.getStops().map((routeStop: RouteStop) => routeStop.getStation());
        stationsInvolved.map((station: Station) => station?.addTripToSchedule(this));
        this.updateScheduleOnAllStations(stationsInvolved);
        return this;
    }

    setNextTrip(trip: Trip): void {
        this.nextTrip = trip;
    }

    getNextTrip(): Trip {
        return this.nextTrip;
    }

    getPrevTrip(): Trip {
        return this.prevTrip;
    }

    setPrevTrip(trip: Trip): void {
        this.prevTrip = trip;
    }

    toggleNextReverse(): void {
        this.nextReverse = !this.nextReverse;
    }

    getNextReverse(): boolean {
        return this.nextReverse;
    }

    redefine(stop: RouteStop, props: OptionalTripStop): void {
        const id = stop.getId();
        this.redefinedProps[id] = {
            ...this.redefinedProps[id],
            ...props
        };
    }

    undefine(stop: RouteStop, props: OptionalTripStop): void {
        const id = stop.getId();
        for (let prop of Object.keys(props)) {
            if (this.redefinedProps[id]?.[prop]) {
                delete this.redefinedProps[id][prop];
            }
        }
    }

    getStops(): TripStop[] {
        return this.getWaypoints().filter(s => s.shouldStop);
    }

    getWaypoints(): TripStop[] {
        const stops = this.route.getWaypoints();
        const index = stops.findIndex((s: RouteStop) => s.getStation() === this.lastStationServed);
        return stops.map((stop, ind) => {
            const sto: TripStop = {
                trip: this,
                route: this.route,
                routeStop: stop,
                id: stop.getId() + '-' + this.id,

                station: stop.getWaypoint(),
                stationRgbColor: stop.getWaypoint().getColor().getRgbString(),
                stationName: stop.getWaypointName(),
                platform: (this.redefinedProps[stop.getId()]?.platform) ??
                    stop.getPlatform(),
                platformNo:
                    (this.redefinedProps[stop.getId()]?.platform?.getNo()) ??
                    stop.getPlatform()?.getNo(),
                hasArrivalTime: stop.hasArrivalTime() || !!this.redefinedProps[stop.getId()]?.arrivalTime,
                hasDepartureTime: stop.hasDepartureTime() || !!this.redefinedProps[stop.getId()]?.departureTime,
                arrivalTime:
                    (this.redefinedProps[stop.getId()]?.arrivalTime) ??
                    this.departureTime + stop.getArrivalTime(),
                departureTime:
                    (this.redefinedProps[stop.getId()]?.departureTime) ??
                    this.departureTime + stop.getDepartureTime(),
                realArrivalTime: (this.redefinedProps[stop.getId()]?.realArrivalTime) ?? -1,
                realDepartureTime: (this.redefinedProps[stop.getId()]?.realDepartureTime) ?? -1,
                arrivalTimeString: '',
                departureTimeString: '',
                realArrivalTimeString: '',
                realDepartureTimeString: '',
                isServed: (ind <= index),
                atStation: (ind === index) && (this.atStation === stop.getStation()),
                isArrivalStation: ind === stops.length - 1,
                isDepartureStation: ind === 0,
                shouldStop: stop.getShouldStop(),
                isStation: stop.isStation()
            };

            sto.arrivalTimeString = Util.timeToStr(sto.arrivalTime);
            sto.departureTimeString = Util.timeToStr(sto.departureTime);
            sto.realArrivalTimeString = Util.timeToStr(sto.realArrivalTime);
            sto.realDepartureTimeString = Util.timeToStr(sto.realDepartureTime);

            return sto;
        });
    }

    getStationDepartureTime(station: Station): number {
        const list = this.route.getStops().filter(stop => stop.getStation() === station);
        if (list.length === 0) return null;
        const stop = list[0];

        // copied from above
        return (this.redefinedProps[stop.getId()]?.departureTime) ??
            this.departureTime + stop.getDepartureTime();
    }

    // set on arrival, set on depart, on arrival again when terminated
    setStationServed(station: Station): void {
        this.lastStationServed = station;
        this.atStation = station;

        const stop = this.route.getStops().find((s: RouteStop) => s.getStation() === station);
        const time = this.store.getTickCount();

        if (stop) {
            if (!this.redefinedProps[stop.getId()] || !this.redefinedProps[stop.getId()].realArrivalTime) {
                this.redefine(stop, { realArrivalTime: time });
            }
            this.redefine(stop, { realDepartureTime: time });
        }
        this.updateScheduleOnAllStations();
    }

    // set when depart
    setAtStation(atStation: Station): void {
        this.atStation = atStation;
        this.updateScheduleOnAllStations();
    }

    private updateScheduleOnAllStations(excludeStations: Station[] = []) {
        this.store.getAllOf(Symbol.for("Station")).map((station: Station) => {
            if (!excludeStations.includes(station)) {
                station.addTripToSchedule(null);
            }
        });
    }

    // todo make it easier with the new logic

    private getStationFollowingStops(station: Station): TripStop[] {
        const stops = this.getWaypoints();
        const index = stops.findIndex(s => s.station === station);
        if (index === -1) return [];
        return stops.slice(index + 1);
    }

    private getRemainingStops(): TripStop[] {
        return this.lastStationServed ? this.getStationFollowingStops(this.lastStationServed) : this.getStops();
    }

    getRoute(): Route {
        return this.route;
    }

    getDepartureTime(): number {
        return this.departureTime;
    }

    setDepartureTime(time: number): void {
        this.departureTime = time;
    }

    getDepartureTimeStr(): string {
        return Util.timeToString(this.departureTime);
    }

    getArrivalTimeStr(): string {
        return Util.timeToString(this.getArrivalTime());
    }

    persist(): Object {
        const redefinedProps = {};
        for (let stopId in this.redefinedProps) {
            redefinedProps[stopId] = {
                ...this.redefinedProps[stopId],
                platform: this.redefinedProps[stopId].platform?.getId()
            };
        }

        return {
            id: this.id,
            type: 'Trip',
            route: this.route.getId(),
            departureTime: this.departureTime,
            prevTrip: this.prevTrip?.getId(),
            nextTrip: this.nextTrip?.getId(),
            nextReverse: this.nextReverse,
            hasGroup: this.hasGroup,
            redefinedProps
        };
    }

    persistDeep(): Object {
        return this.xpersistDeep();
    }

    getArrivalTime(): number {
        return Util.last(this.getWaypoints())?.arrivalTime;
    }

    getHasGroup(): boolean {
        return this.hasGroup;
    }

    xpersistDeep(level: number = 1): Object {
        return {
            id: this.id,
            type: 'Trip',
            routeId: this.route.getId(),
            route: this.route.persistDeep(),
            departureTime: this.departureTime,
            departureTimeString: Util.timeToStr(this.departureTime),
            arrivalTime: this.getArrivalTime(),
            arrivalTimeString: Util.timeToStr(this.getArrivalTime()),
            stops: this.getStops(),
            waypoints: this.getWaypoints(),
            prevTrip: this.prevTrip?.getId(),
            nextTrip: this.nextTrip?.getId(),
            nextReverse: this.nextReverse,
            hasGroup: this.hasGroup,
            next: (this.nextTrip && level > 0) ? this.nextTrip.xpersistDeep(level - 1) : null
        };
    }

    load(obj: any, store: Store): void {
        // todo should delete trips, when deleting route
        // so no dead reference to route here
        const route = store.get(obj.route) as Route;
        if (!route) return;

        this.presetId(obj.id);
        this.init(route, obj.departureTime, obj.hasGroup);
        for (let stopId in obj.redefinedProps) {
            const stop = store.get(stopId) as RouteStop;
            const all = store.getAll();
            this.redefine(stop, {
                ...obj.redefinedProps[stopId],
                platform: store.get(obj.redefinedProps[stopId].platform) as Platform
            });
        }
        if (obj.prevTrip) {
            const trip = store.get(obj.prevTrip) as Trip;
            if (trip) {
                this.setPrevTrip(trip);
                trip.setNextTrip(this);
            }
        }
        if (obj.nextTrip) {
            const trip = store.get(obj.nextTrip) as Trip;
            if (trip) {
                this.setNextTrip(trip);
                trip.setPrevTrip(this);
            }
        }
        if (obj.nextReverse === false) {
            this.toggleNextReverse();
        }
    }
    */
}
