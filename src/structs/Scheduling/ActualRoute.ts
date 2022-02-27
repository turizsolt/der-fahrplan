import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Route } from './Route';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { otherEnd, WhichEnd } from '../Interfaces/WhichEnd';
import { RoutePart } from './RoutePart';
import { RouteVariant } from './RouteVariant';
import { ActualRoutePart } from './ActualRoutePart';
import { RoutePartReference } from './RoutePartReference';
import { ActualRoutePartEdge } from './ActualRoutePartEdge';
import { ActualRoutePartStop } from './ActualRoutePartStop';
import { ActualRoutePartJunction } from './ActualRoutePartJunction';
import { RoutePartReferenceDuration } from './RoutePartReferenceDuration';
import { RoutePartReferenceColor } from './RoutePartReferenceColor';

export class ActualRoute extends ActualBaseStorable implements Route {
    private name: string;
    private color: string;
    private parts: Record<WhichEnd, RoutePart> = {
        A: null,
        B: null
    }
    private variants: RouteVariant[] = [];

    init(): Route {
        this.initStore(TYPES.Route);

        this.variants.push(this.store.create<RouteVariant>(TYPES.RouteVariant).init(this, WhichEnd.A));
        this.variants.push(this.store.create<RouteVariant>(TYPES.RouteVariant).init(this, WhichEnd.B));
        return this;
    }

    xinit(): Route {
        this.initStore(TYPES.Route);
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

        this.update();
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

        this.update();
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

    private update() {
        this.variants.forEach(variant => variant.emit('update', {}));
    }

    persist(): Object {
        return {
            id: this.id,
            type: 'Route',
            name: this.name,
            color: this.color,
            parts: this.getParts(WhichEnd.A).map(part => part.persist()),
            variants: this.variants.map(variant => variant.getId())
        }
    }

    persistDeep(): Object {
        return {
            id: this.id,
            type: 'Route',
            name: this.name,
            detailedName: this.getDetailedName(),
            fistStationName: this.getEnd(WhichEnd.A)?.getName(),
            lastStationName: this.getEnd(WhichEnd.B)?.getName(),
            color: this.color,
            variants: this.variants.map(v => v?.getId())
        };
    }

    load(obj: any, store: Store): void {
        this.presetId(obj.id);
        this.xinit();
        this.setColor(obj.color);
        this.setName(obj.name);

        const parts: RoutePart[] = obj.parts.map(part => {
            switch (Symbol.for(part.type)) {
                case TYPES.RoutePartEdge:
                    return new ActualRoutePartEdge({ getDuration: () => part.duration || 0, getId: () => '', getName: () => '' });

                case TYPES.RoutePartStop:
                    const stop = new ActualRoutePartStop(store.get(part.id) as unknown as RoutePartReferenceColor);
                    stop.setStopping(part.isStopping !== undefined ? part.isStopping : true);
                    stop.setDuration(part.duration);
                    return stop;

                case TYPES.RoutePartJunction:
                    return new ActualRoutePartJunction(store.get(part.id) as unknown as RoutePartReference);

                default:
                    return new ActualRoutePart(store.get(part.id) as unknown as RoutePartReference);
            }
        });

        for (let part of parts) {
            this.addPart(WhichEnd.B, part);
        }

        // TODO two-phase loading to apply globally
        setTimeout(() => {
            this.variants = obj.variants.map(variant => store.get(variant) as RouteVariant);
        }, 0);
    }

    remove(): void {
        this.variants.map(v => v.remove());
        this.store.unregister(this);
    }
}
