import { Platform } from '../Interfaces/Platform';
import { PassengerRenderer } from '../Renderers/PassengerRenderer';
import { Coordinate } from '../Geometry/Coordinate';
import { TYPES } from '../TYPES';
import { Passenger } from '../Interfaces/Passenger';
import { ActualBaseBrick } from './ActualBaseBrick';
import { BaseRenderer } from '../Renderers/BaseRenderer';
import { injectable, inject } from 'inversify';
import { Station } from '../Scheduling/Station';
import { BaseBrick } from '../Interfaces/BaseBrick';
import { Route } from '../Scheduling/Route';
import { Wagon } from '../Interfaces/Wagon';
import { BaseBoardable } from '../Interfaces/BaseBoardable';

@injectable()
export class ActualPassenger extends ActualBaseBrick implements Passenger {
  private to: Station;
  private from: Station;
  private place: BaseBoardable;

  init(from: Station, to: Station) {
    super.initStore(TYPES.Passenger);
    this.to = to;
    this.from = from;
    this.setPlace(from);

    this.renderer.init(this);
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

  getPlace(): BaseBoardable {
    return this.place;
  }

  private setPlace(place: BaseBoardable) {
    if (this.place) {
      this.place.unboard(this);
    }
    this.place = place;
    if (this.place) {
      this.place.board(this);
    }
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
