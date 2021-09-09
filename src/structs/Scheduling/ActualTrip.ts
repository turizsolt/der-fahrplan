import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Route } from './Route';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Trip } from './Trip';
import { TripStop, OptionalTripStop } from './TripStop';
import { RouteStop } from './RouteStop';
import { Platform } from '../Interfaces/Platform';
import { Station } from './Station';
import { Util } from '../Util';

export class ActualTrip extends ActualBaseStorable implements Trip {
  private route: Route = null;
  private departureTime: number;
  private redefinedProps: Record<string, OptionalTripStop> = {};
  private lastStationServed: Station = null;
  private atStation: Station = null;

  private prevTrip: Trip = null;
  private nextTrip: Trip = null;
  private nextReverse: boolean = true;
  private hasGroup: boolean = false;

  init(route: Route, departureTime: number, hasGroup: boolean = false): Trip {
    super.initStore(TYPES.Trip);
    this.route = route;
    this.departureTime = departureTime;
    this.hasGroup = hasGroup;

    const stationsInvolved = this.route.getStops().map((routeStop: RouteStop) => routeStop.getStation());
    stationsInvolved.map((station: Station) => station?.addTripToSchedule(this));
    this.updateScheduleOnAllStations(stationsInvolved);
    return this;
  }

  setNextTrip(trip: Trip): void {
    this.nextTrip = trip;
  }

  getNextTrip(): Trip {
    return this.nextTrip;
  }

  setPrevTrip(trip: Trip): void {
    this.prevTrip = trip;
  }

  toggleNextReverse(): void {
    this.nextReverse = !this.nextReverse;
  }

  getNextReverse(): boolean {
    return this.nextReverse;
  }

  redefine(stop: RouteStop, props: OptionalTripStop): void {
    const id = stop.getId();
    this.redefinedProps[id] = {
      ...this.redefinedProps[id],
      ...props
    };
  }

  undefine(stop: RouteStop, props: OptionalTripStop): void {
    const id = stop.getId();
    for (let prop of Object.keys(props)) {
      if (this.redefinedProps[id]?.[prop]) {
        delete this.redefinedProps[id][prop];
      }
    }
  }

  getStops(): TripStop[] {
    return this.getWaypoints().filter(s => s.shouldStop);
  }

  getWaypoints(): TripStop[] {
    const stops = this.route.getStops();
    const index = stops.findIndex((s: RouteStop) => s.getStation() === this.lastStationServed);
    return stops.map((stop, ind) => {
      const sto: TripStop = {
        station: stop.getWaypoint(),
        stationRgbColor: stop.getWaypoint().getColor().getRgbString(),
        platform: stop.getPlatform(),
        stationName: stop.getWaypointName(),
        platformNo:
          (this.redefinedProps[stop.getId()]?.platform?.getNo()) ??
          stop.getPlatform()?.getNo(),
        arrivalTime:
          (this.redefinedProps[stop.getId()]?.arrivalTime) ??
          this.departureTime + stop.getArrivalTime(),
        departureTime:
          (this.redefinedProps[stop.getId()]?.departureTime) ??
          this.departureTime + stop.getDepartureTime(),
        realArrivalTime: (this.redefinedProps[stop.getId()]?.realArrivalTime) ?? -1,
        realDepartureTime: (this.redefinedProps[stop.getId()]?.realDepartureTime) ?? -1,
        arrivalTimeString: '',
        departureTimeString: '',
        realArrivalTimeString: '',
        realDepartureTimeString: '',
        isServed: (ind <= index),
        atStation: (ind === index) && (this.atStation === stop.getStation()),
        isArrivalStation: ind === stops.length - 1,
        isDepartureStation: ind === 0,
        shouldStop: stop.getShouldStop(),
        isStation: stop.isStation()
      };

      sto.arrivalTimeString = Util.timeToStr(sto.arrivalTime);
      sto.departureTimeString = Util.timeToStr(sto.departureTime);
      sto.realArrivalTimeString = Util.timeToStr(sto.realArrivalTime);
      sto.realDepartureTimeString = Util.timeToStr(sto.realDepartureTime);

      return sto;
    });
  }

  getStationDepartureTime(station: Station): number {
    const list = this.route.getStops().filter(stop => stop.getStation() === station);
    if (list.length === 0) return null;
    const stop = list[0];

    // copied from above
    return (this.redefinedProps[stop.getId()]?.departureTime) ??
      this.departureTime + stop.getDepartureTime();
  }

  getStationFollowingStops(station: Station): TripStop[] {
    const stops = this.getWaypoints();
    const index = stops.findIndex(s => s.station === station);
    if (index === -1) return [];
    return stops.slice(index + 1);
  }

  isStillInFuture(station: Station): boolean {
    const stops = this.getWaypoints();
    const indexStation = stops.findIndex(s => s.station === station);
    if (indexStation === -1) return false;
    const indexTrain = stops.findIndex(s => s.station === this.lastStationServed);
    if (indexTrain < indexStation) return true;
    if (indexTrain === indexStation) return (this.atStation === station);
    return false;
  }

  setStationServed(station: Station): void {
    this.lastStationServed = station;
    this.atStation = station;

    const stop = this.route.getStops().find((s: RouteStop) => s.getStation() === station);
    const time = this.store.getTickCount();

    if (stop) {
      if (!this.redefinedProps[stop.getId()] || !this.redefinedProps[stop.getId()].realArrivalTime) {
        this.redefine(stop, { realArrivalTime: time });
      }
      this.redefine(stop, { realDepartureTime: time });
    }
    this.updateScheduleOnAllStations();
  }

  setAtStation(atStation: Station): void {
    this.atStation = atStation;
    this.updateScheduleOnAllStations();
  }

  private updateScheduleOnAllStations(excludeStations: Station[] = []) {
    this.store.getAllOf(Symbol.for("Station")).map((station: Station) => {
      if (!excludeStations.includes(station)) {
        station.addTripToSchedule(null);
      }
    });
  }

  getRemainingStops(): TripStop[] {
    return this.getStationFollowingStops(this.lastStationServed);
  }

  getRoute(): Route {
    return this.route;
  }

  getDepartureTime(): number {
    return this.departureTime;
  }

  persist(): Object {
    const redefinedProps = {};
    for (let stopId in this.redefinedProps) {
      redefinedProps[stopId] = {
        ...this.redefinedProps[stopId],
        platform: this.redefinedProps[stopId].platform?.getId()
      };
    }

    return {
      id: this.id,
      type: 'Trip',
      route: this.route.getId(),
      departureTime: this.departureTime,
      prevTrip: this.prevTrip?.getId(),
      nextTrip: this.nextTrip?.getId(),
      nextReverse: this.nextReverse,
      hasGroup: this.hasGroup,
      redefinedProps
    };
  }

  persistDeep(): Object {
    return this.xpersistDeep();
  }

  getArrivalTime(): number {
    return Util.last(this.getWaypoints())?.arrivalTime;
  }

  getHasGroup(): boolean {
    return this.hasGroup;
  }

  xpersistDeep(level: number = 1): Object {
    return {
      id: this.id,
      type: 'Trip',
      routeId: this.route.getId(),
      route: this.route.persistDeep(),
      departureTime: this.departureTime,
      departureTimeString: Util.timeToStr(this.departureTime),
      arrivalTime: this.getArrivalTime(),
      arrivalTimeString: Util.timeToStr(this.getArrivalTime()),
      stops: this.getStops(),
      prevTrip: this.prevTrip?.getId(),
      nextTrip: this.nextTrip?.getId(),
      nextReverse: this.nextReverse,
      hasGroup: this.hasGroup,
      next: (this.nextTrip && level > 0) ? this.nextTrip.xpersistDeep(level - 1) : null
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(store.get(obj.route) as Route, obj.departureTime, obj.hasGroup);
    for (let stopId in obj.redefinedProps) {
      const stop = store.get(stopId) as RouteStop;
      const all = store.getAll();
      this.redefine(stop, {
        ...obj.redefinedProps[stopId],
        platform: store.get(obj.redefinedProps[stopId].platform) as Platform
      });
    }
    if (obj.prevTrip) {
      const trip = store.get(obj.prevTrip) as Trip;
      if (trip) {
        this.setPrevTrip(trip);
        trip.setNextTrip(this);
      }
    }
    if (obj.nextTrip) {
      const trip = store.get(obj.nextTrip) as Trip;
      if (trip) {
        this.setNextTrip(trip);
        trip.setPrevTrip(this);
      }
    }
    if (obj.nextReverse === false) {
      this.toggleNextReverse();
    }
  }
}
