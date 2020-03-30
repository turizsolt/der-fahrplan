import { ActualBaseBrick } from '../Actuals/ActualBaseBrick';
import { BaseRenderer } from '../Renderers/BaseRenderer';
import { Station } from './Station';
import { Store } from '../Interfaces/Store';
import { Circle } from '../Geometry/Circle';
import { Coordinate } from '../Geometry/Coordinate';
import { Platform } from '../Interfaces/Platform';
import { StationRenderer } from '../Renderers/StationRenderer';
import { TYPES } from '../TYPES';
import { inject } from 'inversify';
import { Color } from '../Color';
import { NameGenerator } from '../NameGenerator';
import { Route } from './Route';
import { Passenger } from '../Interfaces/Passenger';
import { Wagon } from '../Interfaces/Wagon';
import { ActualBaseBoardable } from '../Actuals/ActualBaseBoardable';

export class ActualStation extends ActualBaseBoardable implements Station {
  private name: string;
  private circle: Circle;
  private platforms: Platform[];
  private color: Color;

  private removed: boolean = false;
  @inject(TYPES.StationRenderer) private renderer: StationRenderer;

  private announcedTrips: Route[] = [];

  announce(trip: Route) {
    this.announcedTrips.push(trip);
    this.boardedPassengers.map(p => {
      p.listenStationAnnouncement(this, trip);
    });
  }

  announceArrived(wagon: Wagon, platform: Platform, trip: Route) {
    platform.getBoardedPassengers().map(p => {
      p.listenStationArrivingAnnouncement(this, platform, wagon, trip);
    });

    this.announcedTrips = this.announcedTrips.filter(t => t !== trip);
  }

  init(circle: Circle): Station {
    super.initStore(TYPES.Station);
    this.circle = circle;
    this.name = NameGenerator.next();
    this.platforms = [];
    this.color = Color.CreateRandom();
    this.store
      .getFiltered(x => x.constructor.name === 'ActualPlatform')
      .forEach(pl => {
        const platform = pl as Platform;
        if (platform.isPartOfStation(this)) {
          this.addPlatform(platform);
        }
      });

    this.renderer.init(this);

    return this;
  }

  getPlatforms(): Platform[] {
    return this.platforms;
  }

  addPlatform(platform: Platform): void {
    if (!platform.getStation()) {
      this.platforms.push(platform);
      platform.setStation(this);
    }
  }

  removePlatform(platform: Platform): void {
    platform.setStation(null);
    this.platforms = this.platforms.filter(p => p !== platform);
  }

  getCircle(): Circle {
    return this.circle;
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
    return this.renderer;
  }

  remove(): boolean {
    this.store.unregister(this);
    this.removed = true;
    this.platforms.map(platform => this.removePlatform(platform));
    this.renderer.update();
    return true;
  }

  isRemoved(): boolean {
    return this.removed;
  }

  persist(): Object {
    return {
      id: this.id,
      circle: {
        x: this.circle.a.x,
        y: this.circle.a.y,
        z: this.circle.a.z,
        r: this.circle.r
      },
      type: 'Station',
      name: this.name
    };
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
  }
}
