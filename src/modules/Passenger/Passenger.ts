import { Platform } from '../Station/Platform';
import { BaseBrick } from '../../structs/Interfaces/BaseBrick';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Station } from '../Station/Station';
import { Route } from '../../structs/Scheduling/Route';
import { Color } from '../../structs/Color';
import { Boardable } from '../../mixins/Boardable';
import { Train } from '../Train/Train';

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
        trip: Route
    );
    listenWagonStoppedAtAnnouncement(
        station: Station,
        platform: Platform,
        train: Train,
        trip: Route
    );
    updatePos(pos: Coordinate): void;
    getFrom(): Station;
    getTo(): Station;
    setPlace(place: Place): void;
    getWaitingFor(): Route;
    setWaitingFor(route: Route): void;
    getNext(): Station;
    setNext(next: Station);
    justArrived(): void;
}
