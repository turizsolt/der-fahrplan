import { ActualBaseBrick } from '../Actuals/ActualBaseBrick';
import { BaseRenderer } from '../Renderers/BaseRenderer';
import { Station } from './Station';
import { Store } from '../Interfaces/Store';
import { Circle } from '../Geometry/Circle';
import { Coordinate } from '../Geometry/Coordinate';
import { Platform } from '../Interfaces/Platform';
import { StationRenderer } from '../Renderers/StationRenderer';
import { TYPES } from '../../di/TYPES';
import { inject } from 'inversify';
import { Color } from '../Color';
import { NameGenerator } from '../NameGenerator';
import { Route } from './Route';
import { Passenger } from '../Interfaces/Passenger';
import { ActualBoardable } from '../../mixins/ActualBoardable';
import { Train } from './Train';
import { Trip } from './Trip';
import { TripInSchedule } from './TripInSchedule';
import { ShortestPath } from './ShortestPath';
const PriorityQueue = require("@darkblue_azurite/priority-queue");

export class ActualStation extends ActualBaseBrick implements Station {
  private name: string;
  private circle: Circle;
  private platforms: Platform[];
  private color: Color;

  private removed: boolean = false;
  @inject(TYPES.StationRenderer) private renderer: StationRenderer;

  private announcedTrips: Route[] = [];

  // neu

  private scheduledTrips: TripInSchedule[] = [];
  private scheduledShortestPathes: Record<string, ShortestPath> = {};

  addTripToSchedule(trip: Trip): void {
    const departureTime = trip.getStationDepartureTime(this);
    this.scheduledTrips.push({
      trip,
      departureTime
    });
    this.scheduledTrips.sort((a, b) => (a.departureTime - b.departureTime));
    this.findShortestPathToEveryStation();
  }

  findShortestPathToEveryStation(): void {
    const pq = new PriorityQueue([], (a, b) => a.arrivalTime - b.arrivalTime);

    this.scheduledTrips.map(tripIS => {
      const trip = tripIS.trip;
      trip.getStationFollowingStops(this).map(stop => {
        pq.enqueue({ initialDepartureTime: trip.getStationDepartureTime(this), arrivalTime: stop.arrivalTime, station: stop.station, trip });
      });
    });

    while (!pq.isEmpty()) {
      const element: { initialDepartureTime: number, arrivalTime: number, station: Station, trip: Trip } = pq.dequeue();

      if (!this.scheduledShortestPathes[element.station.getId()]) {
        this.scheduledShortestPathes[element.station.getId()] = {
          station: element.station,
          departureTime: element.initialDepartureTime,
          path: [{ trip: element.trip, station: element.station }]
        }
      }
    }
  }

  // end of neu


  private boardable: ActualBoardable = new ActualBoardable();

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

  initX(): Station {
    super.initStore(TYPES.Station);
    this.circle = null;
    this.name = NameGenerator.next();
    this.platforms = [];
    this.color = Color.CreateRandom();
    this.renderer.init(this);
    return this;
  }

  announce(trip: Route) {
    this.announcedTrips.push(trip);
    this.updatePlatforms();
  }

  deannounce(trip: Route) {
    this.announcedTrips = this.announcedTrips.filter(t => t !== trip);
    this.updatePlatforms();
  }

  private updatePlatforms() {
    this.platformTo = {};
    for (let trip of this.announcedTrips) {
      let record = false;
      let platformHere = null;
      for (let stop of trip.getStops()) {
        if (stop.getStation() === this) {
          record = true;
          platformHere = stop.getPlatform();
        } else if (record) {
          this.platformTo[stop.getStation().getId()] = platformHere;
        }
      }
    }

    this.callOnPassengers(p => {
      p.listenStationAnnouncement(this);
    });
  }

  private callOnPassengers(f: (p: Passenger) => void) {
    this.getBoardedPassengers().map(p => {
      f(p);
    });
    for (let platform of this.platforms) {
      platform.getBoardedPassengers().map(p => {
        f(p);
      });
    }
  }

  getAnnouncedTrips(): Route[] {
    return this.announcedTrips;
  }

  private platformTo: Record<string, Platform> = {};

  getPlatformTo(station: Station): Platform {
    return this.platformTo[station.getId()];
  }

  announceArrived(train: Train, platform: Platform, trip: Route) {
    this.callOnPassengers(p => {
      p.listenStationArrivingAnnouncement(this, platform, train, trip);
    });
    //this.announcedTrips = this.announcedTrips.filter(t => t !== trip);
  }

  board(passenger: Passenger): Coordinate {
    this.boardable.board(passenger);

    if (!this.circle) return null;

    const rand = Math.random() * Math.PI * 2 - Math.PI;
    const dist = Math.random() * 5;
    const offset = new Coordinate(
      Math.sin(rand) * dist,
      0,
      Math.cos(rand) * dist
    );
    return this.circle.a.add(offset);
  }

  unboard(passenger: Passenger): void {
    this.boardable.unboard(passenger);
  }

  getBoardedPassengers(): Passenger[] {
    return this.boardable.getBoardedPassengers();
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
      circle: this.circle && {
        x: this.circle.a.x,
        y: this.circle.a.y,
        z: this.circle.a.z,
        r: this.circle.r
      },
      type: 'Station',
      name: this.name
    };
  }

  // todo move to a util something
  private timeToStr(time: number): string {
    if (time === undefined) return '';


    const sec = time % 60;
    const minutes = (time - sec) / 60;
    const min = minutes % 60;
    const hour = (minutes - min) / 60;
    return hour
      ? hour.toString() + (min < 10 ? ':0' : ':') + min.toString()
      : min.toString();
  }

  persistDeep(): Object {
    console.log('keys', Object.keys(this.scheduledShortestPathes));
    return {
      id: this.id,
      type: 'Station',
      name: this.name,
      schedule: this.scheduledTrips.map((tripIS: TripInSchedule) => tripIS.trip.persistDeep()),
      shortestPathes: Object.keys(this.scheduledShortestPathes).map(key => {
        const path = this.scheduledShortestPathes[key];
        console.log('path', path);
        return {
          stationId: path.station.getId(),
          stationName: path.station.getName(),
          departureTime: path.departureTime,
          departureTimeString: this.timeToStr(path.departureTime),
          firstTripName: (path.path.length > 0) ? path.path[0].trip.getRoute().getName() : '<Error>'
        }
      })
    };
  }

  persistFlat(): Object {
    return {
      id: this.id,
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
