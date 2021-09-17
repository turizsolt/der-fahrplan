import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Station } from './Station';
import { Store } from '../../structs/Interfaces/Store';
import { Circle } from '../../structs/Geometry/Circle';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { AbstractPlatform } from './AbstractPlatform';
import { TYPES } from '../../di/TYPES';
import { inject, injectable } from 'inversify';
import { Color } from '../../structs/Color';
import { NameGenerator } from '../../structs/NameGenerator';
import { Route } from '../../structs/Scheduling/Route';
import { Passenger } from '../Passenger/Passenger';
import { ActualBoardable } from '../../mixins/ActualBoardable';
import { Trip } from '../../structs/Scheduling/Trip';
import { TripInSchedule } from '../../structs/Scheduling/TripInSchedule';
import { Train } from '../Train/Train';
import { WaitingHall } from './WaitingHall';
import { applyMixins } from '../../mixins/ApplyMixins';
import { Emitable } from '../../mixins/Emitable';
const PriorityQueue = require('@darkblue_azurite/priority-queue');

export interface ActualStation extends Emitable { }
const doApply = () => applyMixins(ActualStation, [Emitable]);
@injectable()
export class ActualStation extends ActualBaseBrick implements Station {
    private name: string;
    private circle: Circle;
    private platforms: AbstractPlatform[];
    private waitingHalls: WaitingHall[];
    private color: Color;
    private noCounter: number;

    private removed: boolean = false;

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

    updateArrivingPlatform(platform: AbstractPlatform, trip: Trip): void {
        console.log('updateArrivingPlatform');

        const stop = trip.getRoute().getStops().find(s => s.getStation() === this);
        if (stop && stop.getPlatform() !== platform) {
            trip.redefine(stop, { platform });
            // todo update in scheduled - maybe not needed at all
            // const schedTrip = this.scheduledTrips.find(t => t.trip === trip);

            this.update();
        }
    }

    // end of neu

    private boardable: ActualBoardable = new ActualBoardable();

    init(circle: Circle): Station {
        super.initStore(TYPES.Station);
        this.circle = circle;
        this.name = NameGenerator.next();
        this.platforms = [];
        this.waitingHalls = [];
        this.color = Color.CreateRandom();
        this.noCounter = 0;
        this.emit('init', this);

        return this;
    }

    initX(): Station {
        super.initStore(TYPES.Station);
        this.circle = null;
        this.name = NameGenerator.next();
        this.platforms = [];
        this.waitingHalls = [];
        this.color = Color.CreateRandom();
        this.noCounter = 0;
        this.emit('init', this);
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

    private platformTo: Record<string, AbstractPlatform> = {};

    getPlatformTo(station: Station): AbstractPlatform {
        return this.platformTo[station.getId()];
    }

    announceArrived(train: Train, platform: AbstractPlatform, trip: Trip) {
        /*
        this.callOnPassengers(p => {
            p.listenStationArrivingAnnouncement(
                this,
                platform,
                train,
                trip.getRoute()
            );
        });
        */
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

    getPlatforms(): AbstractPlatform[] {
        return this.platforms;
    }

    addPlatform(platform: AbstractPlatform): void {
        this.platforms.push(platform);
        if (!platform.getNo()) {
            platform.setNo((++this.noCounter).toString());
        }
    }

    removePlatform(platform: AbstractPlatform): void {
        this.platforms = this.platforms.filter(p => p !== platform);
    }

    getWaitingHalls(): WaitingHall[] {
        return this.waitingHalls;
    }

    addWaitingHall(waitingHall: WaitingHall): void {
        this.waitingHalls.push(waitingHall);
    }

    removeWaitingHall(waitingHall: WaitingHall): void {
        this.waitingHalls = this.waitingHalls.filter(w => w !== waitingHall);
    }

    getCircle(): Circle {
        return this.circle;
    }

    setCircle(circle: Circle): void {
        this.circle = circle;
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
        return null;
    }

    remove(): boolean {
        this.store.unregister(this);
        this.removed = true;
        this.platforms.map(platform => this.removePlatform(platform));
        this.emit('update', this.persistDeep());
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
            name: this.name,
            noCounter: this.noCounter
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

    select(): void {
        super.select();
        this.update();
    }

    deselect(): void {
        super.deselect();
        this.update();
    }

    update() {
        this.emit('update', this);

        if (this.isSelected()) {
            const deep = this.persistDeep();
            this.emit('info', Object.freeze(deep));
        }
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
        this.noCounter = obj.noCounter ?? 0;
    }
}
doApply();
