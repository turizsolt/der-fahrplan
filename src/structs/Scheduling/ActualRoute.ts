import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Route } from './Route';
import { RouteStop } from './RouteStop';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Station } from '../../modules/Station/Station';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { otherEnd, WhichEnd } from '../Interfaces/WhichEnd';
import { RoutePart } from './RoutePart';
import { RouteVariant } from './RouteVariant';
import { ActualRouteVariant } from './ActualRouteVariant';

export class ActualRoute extends ActualBaseStorable implements Route {
    private name: string;
    private color: string;
    private parts: Record<WhichEnd, RoutePart> = {
        A: null,
        B: null
    }
    private variants: RouteVariant[] = [];

    init(): Route {
        this.variants.push(new ActualRouteVariant(this, WhichEnd.A));
        this.variants.push(new ActualRouteVariant(this, WhichEnd.B));
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

    getEnd(whichEnd: WhichEnd): RoutePart {
        return this.parts[whichEnd];
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

    getVariants(): RouteVariant[] {
        return this.variants;
    }

    /********************/

    getDetailedName(): string {
        const from = this.parts.A?.getName();
        const to = this.parts.B?.getName();

        if (from && to) {
            return from + ">>" + to;
        } else if (from) {
            return from;
        } else if (to) {
            return to;
        } else return 'Unknown terminus';
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
        for (let part of this.getParts(WhichEnd.A)) {
            if (part.getType() === TYPES.RoutePartEdge) {
                result.push({
                    from: part.getNext(WhichEnd.A).getRef() as RailMapNode,
                    to: part.getNext(WhichEnd.B).getRef() as RailMapNode,
                });
            }
        }
        return result;
    }

    /********************/

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
    }
*/
