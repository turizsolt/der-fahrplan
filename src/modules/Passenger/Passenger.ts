import { Platform } from '../Station/Platform';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Station } from '../Station/Station';
import { Color } from '../../structs/Color';
import { Boardable } from '../../mixins/Boardable';
import { Train } from '../Train/Train';
import { RouteVariant } from '../../structs/Scheduling/RouteVariant';

export type Place = Boardable & BaseBrick;

export interface Passenger extends BaseBrick {
    init(from: Station, to: Station);
    getPlace(): Place;
    getColor(): Color;
    getPosition(): Coordinate;
    listenStationAnnouncement(station: Station);
    listenStationArrivingAnnouncement(
        station: Station,
        platform: Platform,
        train: Train,
        trip: RouteVariant
    );
    listenWagonStoppedAtAnnouncement(
        station: Station,
        platform: Platform,
        train: Train,
        trip: RouteVariant
    );
    updatePos(pos: Coordinate): void;
    getFrom(): Station;
    getTo(): Station;
    setPlace(place: Place): void;
    getWaitingFor(): RouteVariant;
    setWaitingFor(route: RouteVariant): void;
    getNext(): Station;
    setNext(next: Station);
    justArrived(): void;
}
