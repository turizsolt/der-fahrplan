import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Trip } from './Trip';
import { TripStop, OptionalTripStop } from './TripStop';
import { Station } from '../../modules/Station/Station';
import { RoutePart } from './RoutePart';
import { RoutePartReference } from './RoutePartReference';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { RouteVariant } from './RouteVariant';
import { otherEnd } from '../Interfaces/WhichEnd';
import { AbstractPlatform } from '../../modules/Station/AbstractPlatform';
import { Util } from '../Util';
import { Platform } from '../../modules/Station/Platform';

export class ActualTrip extends ActualBaseStorable implements Trip {
    private routeVariant: RouteVariant;
    private departureTime: number;
    private arrivalTime: number;
    private routePartAt: RoutePart;
    private redefinedProps: Record<string, OptionalTripStop> = {};
    private routeVariantSubscribe: (data: any) => void;

    private prevTrip: Trip = null;
    private nextTrip: Trip = null;
    private nextReverse: boolean = true;

    init(routeVariant: RouteVariant, departureTime: number): Trip {
        super.initStore(TYPES.Trip);
        this.routeVariant = routeVariant;
        this.departureTime = departureTime;

        this.routeVariantSubscribe = () => this.updateRouteVariant();
        this.routeVariantSubscribe.bind(this);

        this.routeVariant.on('update', this.routeVariantSubscribe);
        this.updateRouteVariant();

        return this;
    }

    private updateRouteVariant(): void {
        let time = 0;
        let iter = this.routeVariant.getFirstStop();
        while (iter) {
            const arrivalTime = time;
            const duration = iter.getDuration();
            time += duration;
            const departureTime = time;
            if (iter.getRef()) {
                this.redefine(iter.getRef(), { arrivalTime, departureTime, duration });
            }
            iter = iter.getNext(this.routeVariant.getStartEnd());
        }

        this.arrivalTime = this.redefinedProps[(this.routeVariant.getLastStop().getRef() as RailMapNode).getId()].arrivalTime;

        this.undefine(this.routeVariant.getFirstStop().getRef(), { arrivalTime: undefined });
        this.undefine(this.routeVariant.getLastStop().getRef(), { departureTime: undefined });
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

    updatePlatformInfo(routePart: RoutePart, platform: AbstractPlatform): void {
        this.redefine(routePart.getRef(), { platform });
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

        // todo, it seems useful generally
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

    isAtLastStation(): boolean {
        return !this.routePartAt.getNext(this.routeVariant.getStartEnd());
    }

    // todo returning the stops to show on the side

    private getPartData(part: RoutePart, isServed: boolean): TripStop {
        const redefined = this.redefinedProps[(part.getRef() as RailMapNode).getId()];
        return {
            trip: this,
            route: this.getRouteVariant()?.getRoute(),
            routeVariant: this.getRouteVariant(),
            routePart: part,

            id: this.id + '', // todo get id from part

            station: part.getRef() as Station,
            stationRgbColor: (part.getRef() as Station)?.getColor()?.getRgbString(),
            stationName: part.getRef()?.getName(),
            platform: redefined?.platform,
            platformNo: redefined?.platform?.getNo(),

            hasArrivalTime: redefined.arrivalTime !== undefined,
            hasDepartureTime: redefined.departureTime !== undefined,
            arrivalTime: this.departureTime + redefined.arrivalTime || 0,
            departureTime: this.departureTime + redefined.departureTime || 0,
            realArrivalTime: redefined.realArrivalTime || -1,
            realDepartureTime: redefined.realDepartureTime || -1,
            duration: redefined.duration || 0,

            isServed,
            atStation: this.routePartAt === part,
            isArrivalStation: !part.getNext(this.routeVariant.getStartEnd()),
            isDepartureStation: !part.getNext(otherEnd(this.routeVariant.getStartEnd())),
            shouldStop: true,
            isStation: part.getType() === TYPES.RoutePartStop,
            isReverseStop: false
        };
    }

    getWaypoints(): TripStop[] {
        const result: TripStop[] = [];
        let isServed = true;
        let iter = this.routeVariant.getFirstStop();
        while (iter) {
            if ([TYPES.RoutePartStop, TYPES.RoutePartJunction].includes(iter.getType())) {
                result.push(this.getPartData(iter, isServed));
            }

            if (this.routePartAt === iter) {
                isServed = false;
            }

            iter = iter.getNext(this.routeVariant.getStartEnd());
        }
        return result;
    };

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
            routeVariant: this.routeVariant.getId(),
            departureTime: this.departureTime,
            prevTrip: this.prevTrip?.getId(),
            nextTrip: this.nextTrip?.getId(),
            nextReverse: this.nextReverse,
            redefinedProps
        };
    }

    persistDeep(): Object {
        return this.xpersistDeep();
    }

    xpersistDeep(level: number = 1): Object {
        return {
            id: this.id,
            type: 'Trip',
            routeVariantId: this.routeVariant.getId(),
            routeVariant: this.routeVariant.persistDeep(),
            departureTime: this.departureTime,
            departureTimeString: Util.timeToStr(this.departureTime),
            arrivalTime: this.arrivalTime,
            arrivalTimeString: Util.timeToStr(this.arrivalTime),
            stops: this.getWaypoints().filter(x => x.shouldStop),
            waypoints: this.getWaypoints(),
            prevTrip: this.prevTrip?.getId(),
            nextTrip: this.nextTrip?.getId(),
            nextReverse: this.nextReverse,
            next: (this.nextTrip && level > 0) ? this.nextTrip.xpersistDeep(level - 1) : null
        };
    }

    load(obj: any, store: Store): void {
        // todo should delete trips, when deleting route
        // so no dead reference to route here
        const routeVariant = store.get(obj.routeVariant) as RouteVariant;
        if (!routeVariant) return;

        this.presetId(obj.id);
        this.init(routeVariant, obj.departureTime);

        for (let stopId in obj.redefinedProps) {
            this.redefine({ getName: () => '', getId: () => stopId } as RoutePartReference, {
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
}
