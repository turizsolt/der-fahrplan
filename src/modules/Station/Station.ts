import { Circle } from '../../structs/Geometry/Circle';
import { Color } from '../../structs/Color';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { Boardable } from '../../mixins/Boardable';
import { Trip } from '../../structs/Scheduling/Trip';
import { TripInSchedule } from '../../structs/Scheduling/TripInSchedule';
import { Train } from '../../modules/Train/Train';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';
import { WaitingHall } from './WaitingHall';
import { AbstractPlatform } from './AbstractPlatform';
import { RouteVariant } from '../../structs/Scheduling/RouteVariant';

export interface Station extends BaseBrick, Boardable, RailMapNode {
    init(circle: Circle): Station;
    initX(): Station;
    getName(): string;
    setName(name: string);
    getAnnouncedTrips(): RouteVariant[];
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
    announce(trip: RouteVariant);
    deannounce(trip: RouteVariant);
    updateArrivingPlatform(platform: AbstractPlatform, trip: Trip): void;

    addTripToSchedule(trip: Trip);
    getScheduledTrips(): TripInSchedule[];

    setTripAsGone(trip: Trip): void;
}
