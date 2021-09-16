import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Station } from './Station';
import { Store } from '../../structs/Interfaces/Store';
import { Circle } from '../../structs/Geometry/Circle';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Platform } from './Platform';
import { StationRenderer } from '../../structs/Renderers/StationRenderer';
import { TYPES } from '../../di/TYPES';
import { inject } from 'inversify';
import { Color } from '../../structs/Color';
import { NameGenerator } from '../../structs/NameGenerator';
import { Route } from '../../structs/Scheduling/Route';
import { Passenger } from '../Passenger/Passenger';
import { ActualBoardable } from '../../mixins/ActualBoardable';
import { Trip } from '../../structs/Scheduling/Trip';
import { TripInSchedule } from '../../structs/Scheduling/TripInSchedule';
import { Util } from '../../structs/Util';
import { Train } from '../Train/Train';
const PriorityQueue = require('@darkblue_azurite/priority-queue');

export class ActualStation extends ActualBaseBrick implements Station {
    private name: string;
    private circle: Circle;
    private platforms: Platform[];
    private color: Color;

    private removed: boolean = false;
    @inject(TYPES.StationRenderer) private renderer: StationRenderer;

    private announcedTrips: Route[] = [];

    private scheduledTrips: TripInSchedule[] = [];

    getScheduledTrips(): TripInSchedule[] {
        return this.scheduledTrips;
    }

    addTripToSchedule(trip: Trip): void {
        if (trip) {
            const departureTime = trip.getStationDepartureTime(this);
            this.scheduledTrips.push({
                trip,
                departureTime
            });
            this.scheduledTrips.sort((a, b) => a.departureTime - b.departureTime);
        }

        this.callOnPassengers(p => {
            p.listenStationAnnouncement(this);
        });
    }

    // end of neu

    private boardable: ActualBoardable = new ActualBoardable();

    init(circle: Circle): Station {
        super.initStore(TYPES.Station);
        this.circle = circle;
        this.name = NameGenerator.next();
        this.platforms = [];
        this.color = Color.CreateRandom();
        this.store
            .getFiltered(x => x.constructor.name === 'ActualPlatform')
            .forEach(pl => {
                const platform = pl as Platform;
                if (platform.isPartOfStation(this)) {
                    this.addPlatform(platform);
                }
            });

        this.renderer.init(this);

        return this;
    }

    initX(): Station {
        super.initStore(TYPES.Station);
        this.circle = null;
        this.name = NameGenerator.next();
        this.platforms = [];
        this.color = Color.CreateRandom();
        this.renderer.init(this);
        return this;
    }

    announce(trip: Route) {
        this.announcedTrips.push(trip);
        this.updatePlatforms();
    }

    deannounce(trip: Route) {
        this.announcedTrips = this.announcedTrips.filter(t => t !== trip);
        this.updatePlatforms();
    }

    private updatePlatforms() {
        this.platformTo = {};
        for (let trip of this.announcedTrips) {
            let record = false;
            let platformHere = null;
            for (let stop of trip.getStops()) {
                if (stop.getStation() === this) {
                    record = true;
                    platformHere = stop.getPlatform();
                } else if (record) {
                    this.platformTo[stop.getStation().getId()] = platformHere;
                }
            }
        }

        this.callOnPassengers(p => {
            p.listenStationAnnouncement(this);
        });
    }

    private callOnPassengers(f: (p: Passenger) => void) {
        this.getBoardedPassengers().map(p => {
            f(p);
        });
        for (let platform of this.platforms) {
            platform.getBoardedPassengers().map(p => {
                f(p);
            });
        }
    }

    getAnnouncedTrips(): Route[] {
        return this.announcedTrips;
    }

    private platformTo: Record<string, Platform> = {};

    getPlatformTo(station: Station): Platform {
        return this.platformTo[station.getId()];
    }

    announceArrived(train: Train, platform: Platform, trip: Trip) {
        this.callOnPassengers(p => {
            p.listenStationArrivingAnnouncement(
                this,
                platform,
                train,
                trip.getRoute()
            );
        });
        trip.setStationServed(this);
        //this.announcedTrips = this.announcedTrips.filter(t => t !== trip);
    }

    board(passenger: Passenger): Coordinate {
        this.boardable.board(passenger);

        // if (this.platforms.length === 0) {
        if (!this.circle) return null;

        const rand = Math.random() * Math.PI * 2 - Math.PI;
        const dist = Math.random() * 5;
        const offset = new Coordinate(
            Math.sin(rand) * dist,
            0,
            Math.cos(rand) * dist
        );
        return this.circle.a.add(offset);
        // }
        // else {
        //  return this.platforms[0].pseudoBoard();
        //}
    }

    unboard(passenger: Passenger): void {
        this.boardable.unboard(passenger);
    }

    getBoardedPassengers(): Passenger[] {
        return this.boardable.getBoardedPassengers();
    }

    getPlatforms(): Platform[] {
        return this.platforms;
    }

    addPlatform(platform: Platform): void {
        if (!platform.getStation()) {
            this.platforms.push(platform);
            platform.setStation(this);
        }
    }

    removePlatform(platform: Platform): void {
        platform.setStation(null);
        this.platforms = this.platforms.filter(p => p !== platform);
    }

    getCircle(): Circle {
        return this.circle;
    }

    getCoord(): Coordinate {
        return this.circle.a;
    }

    getColor(): Color {
        return this.color;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string) {
        this.name = name;
    }

    getRenderer(): BaseRenderer {
        return this.renderer;
    }

    remove(): boolean {
        this.store.unregister(this);
        this.removed = true;
        this.platforms.map(platform => this.removePlatform(platform));
        this.renderer.update();
        return true;
    }

    isRemoved(): boolean {
        return this.removed;
    }

    persist(): Object {
        return {
            id: this.id,
            circle: this.circle && {
                x: this.circle.a.x,
                y: this.circle.a.y,
                z: this.circle.a.z,
                r: this.circle.r
            },
            type: 'Station',
            name: this.name
        };
    }

    persistDeep(): Object {
        return {
            id: this.id,
            type: 'Station',
            name: this.name,
            rgbColor: this.color.getRgbString(),
            schedule: this.scheduledTrips.map((tripIS: TripInSchedule) =>
                tripIS.trip.persistDeep()
            )
        };
    }

    persistFlat(): Object {
        return {
            id: this.id,
            type: 'Station',
            name: this.name
        };
    }

    load(obj: any, store: Store): void {
        this.presetId(obj.id);
        this.init(
            new Circle(
                new Coordinate(obj.circle.x, obj.circle.y, obj.circle.z),
                obj.circle.r
            )
        );
        this.setName(obj.name);
    }
}
