import { Platform } from '../Interfaces/Platform';
import { PassengerRenderer } from '../Renderers/PassengerRenderer';
import { Coordinate } from '../Geometry/Coordinate';
import { TYPES } from '../../di/TYPES';
import { Passenger, Place } from '../Interfaces/Passenger';
import { ActualBaseBrick } from './ActualBaseBrick';
import { BaseRenderer } from '../Renderers/BaseRenderer';
import { injectable, inject } from 'inversify';
import { Station } from '../Scheduling/Station';
import { Route } from '../Scheduling/Route';
import { Color } from '../Color';
import { Train } from '../Scheduling/Train';
import { Store } from '../Interfaces/Store';
import { ShortestPath } from '../Scheduling/ShortestPath';
import { RouteStop } from '../Scheduling/RouteStop';

@injectable()
export class ActualPassenger extends ActualBaseBrick implements Passenger {
  private to: Station;
  private from: Station;
  private nextStation: Station;
  private nextIdx: number;
  private path: ShortestPath;

  private place: Place;
  private pos: Coordinate = Coordinate.Origo();

  init(from: Station, to: Station) {
    super.initStore(TYPES.Passenger);
    this.to = to;
    this.from = from;

    this.renderer.init(this);
    this.setPath();
    this.listenStationAnnouncement(this.from);
    return this;
  }

  // called from outside, announcements

  listenStationAnnouncement(station: Station): void {
    // todo (reason: it has to be commented, so not clear) moving to the platform, if necessary
    const nextPlace: Place = station.getPlatformTo(this.to) || station;
    if (nextPlace !== this.place) {
      this.setPlace(nextPlace);
    }

    this.setPath();
  }

  listenStationArrivingAnnouncement(
    station: Station,
    platform: Platform,
    train: Train,
    trip: Route
  ) {
    if (!trip) return;

    const toIndex = trip.getStops().findIndex(s => s.getStation() === this.nextStation);
    const stationIndex = trip
      .getStops()
      .findIndex(s => s.getStation() === station);

    if (toIndex !== -1 && stationIndex !== -1 && stationIndex < toIndex) {
      const wagon = train.getFreeWagon();
      if (wagon) {
        this.setPlace(wagon);
      }
    }
  }

  listenWagonStoppedAtAnnouncement(
    station: Station,
    platform: Platform,
    train: Train,
    route: Route
  ) {
    if (this.isStationInPath(station)) {
      if (this.isStationFinal(station)) {
        this.setPlace(null);
      } else {
        this.setNextOnPath();
        this.setPlace(station);
      }
    } else if (!route) {
      this.setPlace(station);
    } else if (!this.isNextStationInTheTrip(route)) {
      this.setPlace(station);
    }
  }

  // private helpers

  private setPath() {
    this.from.addTripToSchedule(null); // todo - clarify - update shortest pathes with this

    this.path = this.from.getShortestPath(this.to);

    this.nextIdx = 0;
    if (this.path && this.path.path.length > 0) {
      this.nextStation = this.path.path[this.nextIdx].station;
    }
  }

  private setNextOnPath() {
    this.nextIdx++;
    this.nextStation = this.path.path[this.nextIdx].station;
  }

  private isStationInPath(station: Station): boolean {
    return this.to === station;
  }

  private isStationFinal(station: Station): boolean {
    return this.nextStation === this.to;
  }

  private isNextStationInTheTrip(route: Route): boolean {
    return route
      .getStops()
      .map((x: RouteStop) => x.getStation())
      .includes(this.nextStation);
  }

  // getters, setters

  getPlace(): Place {
    return this.place;
  }

  getPosition(): Coordinate {
    return this.pos;
  }

  getColor(): Color {
    return this.to.getColor();
  }

  private setPlace(place: Place) {
    if (this.place) {
      this.place.unboard(this);
      if (!place) {
        this.renderer.update();
      }
    }
    this.place = place;
    if (this.place) {
      this.pos = this.place.board(this);
      this.renderer.update();
    }
  }

  updatePos(pos: Coordinate): void {
    this.pos = pos;
    this.renderer.update();
  }

  // todo should remove and use eventing
  @inject(TYPES.PassengerRenderer) private renderer: PassengerRenderer;

  getRenderer(): BaseRenderer {
    return this.renderer;
  }

  // persistance

  persist(): Object {
    return {
      id: this.getId(),
      type: 'Passenger',

      from: this.from.getId(),
      to: this.to.getId(),

      place: this.place.getId()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(store.get(obj.from) as Station, store.get(obj.to) as Station);
    this.setPlace(store.get(obj.place) as Place);
  }
}
