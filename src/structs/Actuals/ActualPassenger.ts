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
import { Wagon } from '../Interfaces/Wagon';
import { Color } from '../Color';

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
    this.setPlace(from);
    return this;
  }

  listenStationAnnouncement(station: Station, trip: Route): void {
    if (this.place !== station) return;

    const fromIndex = trip
      .getStops()
      .findIndex(st => st.getStation() === station);
    if (fromIndex === -1) return;

    const fromStop = trip.getStops()[fromIndex];
    const toStop = trip
      .getStops()
      .slice(fromIndex + 1)
      .find(st => st.getStation() === this.to);
    if (!toStop) return;

    if (fromStop.getPlatform()) {
      this.setPlace(fromStop.getPlatform());
      this.renderer.update();
    }
  }

  listenStationArrivingAnnouncement(
    station: Station,
    platform: Platform,
    wagon: Wagon,
    trip: Route
  ) {
    if (this.place === platform) {
      this.setPlace(wagon);
      this.renderer.update();
    }
  }

  listenWagonStoppedAtAnnouncement(
    station: Station,
    platform: Platform,
    wagon: Wagon,
    trip: Route
  ) {
    if (this.to === station) {
      this.setPlace(null);
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
    throw new Error('Method not implemented.');
  }
  load(obj: Object, store: import('../Interfaces/Store').Store): void {
    throw new Error('Method not implemented.');
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
