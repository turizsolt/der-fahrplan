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

@injectable()
export class ActualPassenger extends ActualBaseBrick implements Passenger {
  private to: Station;
  private from: Station;
  private place: Place;
  private pos: Coordinate = Coordinate.Origo();

  init(from: Station, to: Station) {
    super.initStore(TYPES.Passenger);
    this.to = to;
    this.from = from;

    this.renderer.init(this);
    this.listenStationAnnouncement(this.from);

    return this;
  }

  listenStationAnnouncement(station: Station): void {
    const nextPlace: Place = station.getPlatformTo(this.to) || station;
    if (nextPlace !== this.place) {
      this.setPlace(nextPlace);
      this.renderer.update();
    }
  }

  listenStationArrivingAnnouncement(
    station: Station,
    platform: Platform,
    train: Train,
    trip: Route
  ) {
    if (!trip) return;

    const toIndex = trip.getStops().findIndex(s => s.getStation() === this.to);
    const stationIndex = trip
      .getStops()
      .findIndex(s => s.getStation() === station);

    if (toIndex !== -1 && stationIndex !== -1 && stationIndex < toIndex) {
      const wagon = train.getFreeWagon();
      if (wagon) {
        this.setPlace(wagon);
        this.renderer.update();
      }
    }
  }

  listenWagonStoppedAtAnnouncement(
    station: Station,
    platform: Platform,
    train: Train,
    trip: Route
  ) {
    if (this.to === station) {
      this.setPlace(null);
      this.renderer.update();
    } else if (!trip) {
      this.setPlace(station);
      this.renderer.update();
    } else if (
      !trip
        .getStops()
        .map(x => x.getStation())
        .includes(this.to)
    ) {
      this.setPlace(station);
      this.renderer.update();
    }
  }

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

  /************/

  getRenderer(): BaseRenderer {
    return this.renderer;
  }
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

  public position: Coordinate;
  public offset: Coordinate;
  @inject(TYPES.PassengerRenderer) private renderer: PassengerRenderer;

  //   getPosition(): Coordinate {
  //     return this.position;
  //   }

  //   getTo(): Platform {
  //     return null; //this.to;
  //   }

  //   isOnPlatformOrEngine(): boolean {
  //     return true;
  //   }
}
