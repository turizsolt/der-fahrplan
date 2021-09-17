import { Circle } from '../../structs/Geometry/Circle';
import { Color } from '../../structs/Color';
import { Route } from '../../structs/Scheduling/Route';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { Boardable } from '../../mixins/Boardable';
import { Trip } from '../../structs/Scheduling/Trip';
import { TripInSchedule } from '../../structs/Scheduling/TripInSchedule';
import { Train } from '../../modules/Train/Train';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { WaitingHall } from './WaitingHall';
import { AbstractPlatform } from './AbstractPlatform';
import { Platform } from './Platform';

export interface Station extends BaseBrick, Boardable, RailMapNode {
    init(circle: Circle): Station;
    initX(): Station;
    getName(): string;
    setName(name: string);
    getAnnouncedTrips(): Route[];
    getPlatformTo(station: Station): AbstractPlatform;
    getPlatforms(): AbstractPlatform[];
    getCircle(): Circle;
    setCircle(circle: Circle): void;
    getColor(): Color;
    addPlatform(platform: AbstractPlatform): void;
    removePlatform(platform: AbstractPlatform): void;
    remove(): boolean;
    isRemoved(): boolean;

    getWaitingHalls(): WaitingHall[];
    addWaitingHall(waitingHall: WaitingHall): void;
    removeWaitingHall(waitingHall: WaitingHall): void;

    announceArrived(train: Train, platform: AbstractPlatform, trip: Trip);
    announce(trip: Route);
    deannounce(trip: Route);
    updateArrivingPlatform(platform: AbstractPlatform, trip: Trip): void;

    addTripToSchedule(trip: Trip);
    getScheduledTrips(): TripInSchedule[];
}
