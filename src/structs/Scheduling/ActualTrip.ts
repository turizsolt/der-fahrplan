import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Route } from './Route';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Trip } from './Trip';
import { TripStop, OptionalTripStop } from './TripStop';
import { RouteStop } from './RouteStop';
import { Platform } from '../Interfaces/Platform';
import { Station } from './Station';

export class ActualTrip extends ActualBaseStorable implements Trip {
  private route: Route = null;
  private departureTime: number;
  private redefinedProps: Record<string, OptionalTripStop> = {};

  init(route: Route, departureTime: number): Trip {
    super.initStore(TYPES.Trip);
    this.route = route;
    this.departureTime = departureTime;

    this.route.getStops().map((routeStop: RouteStop) => {
      const station = routeStop.getStation();
      station.addTripToSchedule(this);
    });
    return this;
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
    return this.route.getStops().map(stop => {
      const sto: TripStop = {
        station: stop.getStation(),
        platform: stop.getPlatform(),
        stationName: stop.getStationName(),
        platformNo:
          (this.redefinedProps[stop.getId()]?.platform?.getNo()) ??
          stop.getPlatform()?.getNo(),
        arrivalTime:
          (this.redefinedProps[stop.getId()]?.arrivalTime) ??
          this.departureTime + stop.getArrivalTime(),
        departureTime:
          (this.redefinedProps[stop.getId()]?.departureTime) ??
          this.departureTime + stop.getDepartureTime(),
        arrivalTimeString: '',
        departureTimeString: ''
      };

      sto.arrivalTimeString = this.timeToStr(sto.arrivalTime);
      sto.departureTimeString = this.timeToStr(sto.departureTime);

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
    const stops = this.getStops();
    const index = stops.findIndex(s => s.station === station);
    if (index === -1) return [];
    return stops.slice(index + 1);
  }

  getRoute(): Route {
    return this.route;
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
      redefinedProps
    };
  }

  persistDeep(): Object {
    return {
      id: this.id,
      type: 'Trip',
      routeId: this.route.getId(),
      route: this.route.persistDeep(),
      departureTime: this.departureTime,
      departureTimeString: this.timeToStr(this.departureTime),
      stops: this.getStops()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(store.get(obj.route) as Route, obj.departureTime);
    for (let stopId in obj.redefinedProps) {
      const stop = store.get(stopId) as RouteStop;
      const all = store.getAll();
      this.redefine(stop, {
        ...obj.redefinedProps[stopId],
        platform: store.get(obj.redefinedProps[stopId].platform) as Platform
      });
    }
  }
}
