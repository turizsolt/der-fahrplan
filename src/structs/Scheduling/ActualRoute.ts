import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Route } from './Route';
import { RouteStop } from './RouteStop';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Station } from '../../modules/Station/Station';
import { Util } from '../Util';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { otherEnd, WhichEnd } from '../Interfaces/WhichEnd';
import { RoutePart } from './RoutePart';

export class ActualRoute extends ActualBaseStorable implements Route {
    private name: string;
    private color: string;
    private parts: Record<WhichEnd, RoutePart> = {
        A: null,
        B: null
    }

    constructor(no: string, color: string) {
        super();
        this.setName(no);
        this.setColor(color);
    }

    init(): Route {
        return this;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getColor(): string {
        return this.color;
    }

    setColor(color: string): void {
        this.color = color;
    }

    addPart(whichEnd: WhichEnd, part: RoutePart): void {
        if (!this.parts.A) {
            this.parts.A = part;
            this.parts.B = part;
        } else {
            const p = this.parts[whichEnd];
            part.setNext(whichEnd, p);
            this.parts[whichEnd] = part;
        }
    }

    getParts(whichEnd: WhichEnd): RoutePart[] {
        const result: RoutePart[] = [];
        let iter: RoutePart = this.parts[whichEnd];
        while (iter) {
            result.push(iter);
            iter = iter.getNext(whichEnd);
        }
        return result;
    }

    removePart(whichEnd: WhichEnd): void {
        if (!this.parts[whichEnd]) return;

        const p0 = this.parts[whichEnd];
        const p1 = p0.getNext(whichEnd);

        if (p1) {
            p0.setNext(whichEnd, null);
            p1.setNext(otherEnd(whichEnd), null);
            this.parts[whichEnd] = p1;
        } else {
            this.parts = { A: null, B: null };
        }
    }

    /********************/

    getDetailedName(): string {
        throw new Error('Method not implemented.');
    }
    getStops(): RouteStop[] {
        throw new Error('Method not implemented.');
    }
    getWaypoints(): RouteStop[] {
        throw new Error('Method not implemented.');
    }
    addWaypoint(stop: RouteStop): void {
        throw new Error('Method not implemented.');
    }
    removeStop(stop: RouteStop): void {
        throw new Error('Method not implemented.');
    }
    getFirstStation(): Station {
        throw new Error('Method not implemented.');
    }
    getLastStation(): Station {
        throw new Error('Method not implemented.');
    }
    getFirstWaypoint(): RailMapNode {
        throw new Error('Method not implemented.');
    }
    getLastWaypoint(): RailMapNode {
        throw new Error('Method not implemented.');
    }
    getLastStop(): RouteStop {
        throw new Error('Method not implemented.');
    }
    hasCommonEdgeWith(route: Route): boolean {
        throw new Error('Method not implemented.');
    }
    getEdges(): { from: RailMapNode; to: RailMapNode; }[] {
        throw new Error('Method not implemented.');
    }
    update(): void {
        throw new Error('Method not implemented.');
    }

    /********************/

    load(obj: Object, store: Store): void {

    }

    persist(): Object {
        return {}
    }

    remove(): void {
        this.store.unregister(this);
    }
}

/*
export class ActualRoute extends ActualBaseStorable implements Route {
    private name: string;
    private stops: RouteStop[];
    private color: string;

    init(): Route {
        super.initStore(TYPES.Route);
        this.name = this.id;
        this.stops = [];
        return this;
    }

    getDetailedName(): string {
        if (this.stops.length === 0) {
            return 'Unknown terminus';
        } else if (this.stops.length === 1) {
            return this.stops[0].getWaypointName();
        } else {
            const last = this.stops[this.stops.length - 1];
            return this.stops[0].getWaypointName() + '>>' + last.getWaypointName();
        }
    }

    getStops(): RouteStop[] {
        return this.stops.filter(s => s.getShouldStop());
    }

    getWaypoints(): RouteStop[] {
        return this.stops;
    }

    addWaypoint(stop: RouteStop): void {
        this.stops.push(stop);
        // this.store.getTravelPathes().find(3);
    }

    removeStop(stop: RouteStop): void {
        const foundIndex = this.stops.findIndex(s => s === stop);
        if (foundIndex === 0 || foundIndex === this.stops.length - 1) {
            this.stops = this.stops.filter(s => s !== stop);
        }
        // this.store.getTravelPathes().find(3);
    }

    getFirstStation(): Station {
        return Util.first(this.stops)?.getStation();
    }

    getLastStation(): Station {
        return Util.last(this.stops)?.getStation();
    }

    getFirstWaypoint(): RailMapNode {
        return Util.first(this.stops)?.getWaypoint();
    }

    getLastWaypoint(): RailMapNode {
        return Util.last(this.stops)?.getWaypoint();
    }

    getLastStop(): RouteStop {
        return Util.last(this.stops);
    }

    hasCommonEdgeWith(route: Route): boolean {
        for (let thisEdge of this.getEdges()) {
            for (let otherEdge of route.getEdges()) {
                if (thisEdge.from === otherEdge.from && thisEdge.to === otherEdge.to) {
                    return true;
                }
                if (thisEdge.from === otherEdge.to && thisEdge.to === otherEdge.from) {
                    return true;
                }
            }
        }
        return false;
    }

    getEdges(): { from: RailMapNode, to: RailMapNode }[] {
        const result: { from: RailMapNode, to: RailMapNode }[] = [];
        for (let i = 1; i < this.stops.length; i++) {
            result.push({ from: this.stops[i - 1].getWaypoint(), to: this.stops[i].getWaypoint() });
        }
        return result;
    }

    update(): void {
        let time = 0;
        let first = true;
        for (let waypoint of this.getWaypoints()) {
            if (first) {
                waypoint.setArrivalTime(undefined);
                waypoint.setDepartureTime(0);
                first = false;
            } else {
                time += waypoint.getTimeToStation() + waypoint.getExtraTimeToStation();
                waypoint.setArrivalTime(time);
                time += waypoint.getTimeAtStation() + waypoint.getExtraTimeAtStation();
                waypoint.setDepartureTime(time);
            }
        }
        Util.last(this.getWaypoints())?.setDepartureTime(undefined);
    }

    persist(): Object {
        return {
            id: this.id,
            type: 'Route',
            name: this.name,
            detailedName: this.getDetailedName(),
            stops: this.stops.map(x => x.getId()),
            color: this.color
        };
    }

    persistDeep(): Object {
        return {
            id: this.id,
            type: 'Route',
            name: this.name,
            destination:
                this.stops.length > 0
                    ? this.stops[this.stops.length - 1].getWaypointName()
                    : 'Unknown',
            detailedName: this.getDetailedName(),
            stops: this.stops.map((x, ind) => ({
                ...x.persistDeep(),
                isDepartureStation: ind === 0,
                isArrivalStation: ind === this.stops.length - 1
            })),
            color: this.color
        };
    }

    load(obj: any, store: Store): void {
        this.presetId(obj.id);
        this.init();
        this.setName(obj.name);
        for (let stopId of obj.stops) {
            const x = store.get(stopId) as RouteStop;
            if (x.getType() === TYPES.RouteStop) {
                x.setRoute(this);
            }
            this.addWaypoint(x);
        }
        if (obj.color) {
            this.setColor(obj.color);
        }

        this.update();
    }
}
*/
