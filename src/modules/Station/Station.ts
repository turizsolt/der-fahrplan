import { Circle } from '../../structs/Geometry/Circle';
import { Platform } from './Platform';
import { Color } from '../../structs/Color';
import { Route } from '../../structs/Scheduling/Route';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { Boardable } from '../../mixins/Boardable';
import { Trip } from '../../structs/Scheduling/Trip';
import { TripInSchedule } from '../../structs/Scheduling/TripInSchedule';
import { Train } from '../../modules/Train/Train';
import { RailMapNode } from '../../modules/RailMap/RailMapNode';

export interface Station extends BaseBrick, Boardable, RailMapNode {
    init(circle: Circle): Station;
    initX(): Station;
    getName(): string;
    setName(name: string);
    getAnnouncedTrips(): Route[];
    getPlatformTo(station: Station): Platform;
    getPlatforms(): Platform[];
    getCircle(): Circle;
    getColor(): Color;
    addPlatform(platform: Platform): void;
    removePlatform(platform: Platform): void;
    remove(): boolean;
    isRemoved(): boolean;

    announceArrived(train: Train, platform: Platform, trip: Trip);
    announce(trip: Route);
    deannounce(trip: Route);

    addTripToSchedule(trip: Trip);
    getScheduledTrips(): TripInSchedule[];
}
