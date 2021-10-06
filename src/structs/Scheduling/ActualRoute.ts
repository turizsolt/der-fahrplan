import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Route } from './Route';
import { RouteStop } from './RouteStop';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Station } from '../../modules/Station/Station';
import { Util } from '../Util';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';

export class ActualRoute extends ActualBaseStorable implements Route {
    private name: string;
    private stops: RouteStop[];
    private reverse: Route;
    private color: string;

    init(): Route {
        super.initStore(TYPES.Route);
        this.name = this.id;
        this.stops = [];
        return this;
    }

    setReverse(route: Route): void {
        this.reverse = route;
        if (route.getReverse() != this) {
            route.setReverse(this);
        }
    }

    getReverse(): Route {
        return this.reverse;
    }

    remove(): void {
        this.store.unregister(this);
    }

    getColor(): string {
        return this.color ?? '#fff';
    }

    setColor(color: string): void {
        this.color = color;
    }

    getName(): string {
        return this.name;
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

    setName(name: string) {
        this.name = name;
    }

    getStops(): RouteStop[] {
        return this.stops.filter(s => s.getShouldStop());
    }

    getWaypoints(): RouteStop[] {
        return this.stops;
    }

    addWaypoint(stop: RouteStop): void {
        this.stops.push(stop);
        this.store.getTravelPathes().find(3);
    }

    removeStop(stop: RouteStop): void {
        const foundIndex = this.stops.findIndex(s => s === stop);
        if (foundIndex === 0 || foundIndex === this.stops.length - 1) {
            this.stops = this.stops.filter(s => s !== stop);
        }
        this.store.getTravelPathes().find(3);
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
        for(let waypoint of this.getWaypoints()) {
            if(first) {
                waypoint.setArrivalTime(undefined);
                waypoint.setDepartureTime(0);
                first = false;
            } else {
                time += waypoint.getTimeToStation() + waypoint.getExtraTimeToStation();
                console.log(time);
                waypoint.setArrivalTime(time);
                time += waypoint.getTimeAtStation() + waypoint.getExtraTimeAtStation();
                console.log(time);
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
            reverse: this.getReverse() && this.getReverse().getId(),
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
            reverse: this.getReverse() && this.getReverse().getId(),
            color: this.color
        };
    }

    load(obj: any, store: Store): void {
        this.presetId(obj.id);
        this.init();
        this.setName(obj.name);
        for (let stopId of obj.stops) {
            const x = store.get(stopId) as RouteStop;
            if(x.getType() === TYPES.RouteStop) {
                x.setRoute(this);
            }
            this.addWaypoint(x);
        }
        if (obj.reverse && store.get(obj.reverse)) {
            this.setReverse(store.get(obj.reverse) as Route);
        }
        if (obj.color) {
            this.setColor(obj.color);
        }
    }
}
