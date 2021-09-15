import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Station } from './Station';
import { RouteStop } from './RouteStop';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Platform } from '../Interfaces/Platform';
import { Util } from '../Util';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { PathBlock } from '../../modules/Signaling/PathBlock';

export class ActualRouteStop extends ActualBaseStorable implements RouteStop {
    private waypoint: RailMapNode;
    private platform: Platform;
    private arrivalTime: number;
    private departureTime: number;
    private reverseStop: boolean;
    private shouldStop: boolean;

    init(
        waypoint: RailMapNode,
        platform?: Platform,
        arrivalTime?: number,
        departureTime?: number
    ): RouteStop {
        super.initStore(TYPES.RouteStop);
        this.waypoint = waypoint;
        this.platform = platform;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.reverseStop = false;
        this.setShouldStop(true);
        return this;
    }

    getWaypointName(): string {
        return this.waypoint.getName();
    }

    getStation(): Station {
        return this.waypoint.getType() === TYPES.Station ? (this.waypoint as Station) : null;
    }

    getWaypoint(): RailMapNode {
        return this.waypoint;
    }

    getPlatform(): Platform {
        return this.platform;
    }

    hasArrivalTime(): boolean {
        return this.arrivalTime !== undefined;
    }

    hasDepartureTime(): boolean {
        return this.departureTime !== undefined;
    }

    getArrivalTime(): number {
        return this.arrivalTime || this.departureTime;
    }

    getDepartureTime(): number {
        return this.departureTime;
    }

    setArrivalTime(time: number): void {
        this.arrivalTime = time;
        this.store.getTravelPathes().find(3);
    }

    setDepartureTime(time: number): void {
        this.departureTime = time;
        this.store.getTravelPathes().find(3);
    }

    toggleReverseStop(): void {
        this.reverseStop = !this.reverseStop;
    }

    isReverseStop(): boolean {
        return this.reverseStop;
    }

    setShouldStop(shouldStop: boolean): void {
        this.shouldStop = shouldStop && this.isStation();
        this.store.getTravelPathes().find(3);
    }

    getShouldStop(): boolean {
        return this.shouldStop;
    }

    isStation(): boolean {
        return this.waypoint.getType() === TYPES.Station;
    }

    persist(): Object {
        return {
            id: this.id,
            type: 'RouteStop',
            station: this.waypoint.getId(),
            platform: this.platform && this.platform.getId(),
            arrivalTime: this.arrivalTime,
            departureTime: this.departureTime,
            isReverseStop: this.reverseStop,
            shouldStop: this.getShouldStop(),
            isStation: this.isStation()
        };
    }

    persistDeep(): Object {
        return {
            id: this.id,
            type: 'RouteStop',
            station: this.waypoint.persistShallow(),
            stationName: this.getWaypointName(),
            stationRgbColor: this.waypoint.getColor().getRgbString(),
            platform: this.platform && this.platform.getId(),
            arrivalTime: this.arrivalTime,
            arrivalTimeString: Util.timeToStr(this.arrivalTime, true),
            departureTime: this.departureTime,
            departureTimeString: Util.timeToStr(this.departureTime, true),
            isReverseStop: this.reverseStop,
            shouldStop: this.getShouldStop(),
            isStation: this.isStation()
        };
    }



    load(obj: any, store: Store): void {
        this.presetId(obj.id);
        this.init(
            store.get(obj.station) as (Station | PathBlock) as RailMapNode,
            obj.platform ? (store.get(obj.platform) as Platform) : undefined
        );
        this.setArrivalTime(obj.arrivalTime);
        this.setDepartureTime(obj.departureTime);
        this.reverseStop = !!obj.isReverseStop;
        this.setShouldStop(obj.shouldStop === undefined ? true : obj.shouldStop);
    }
}
