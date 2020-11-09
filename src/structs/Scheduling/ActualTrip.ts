import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Route } from './Route';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Trip } from './Trip';
import { TripStop, OptionalTripStop } from './TripStop';
import { RouteStop } from './RouteStop';

export class ActualTrip extends ActualBaseStorable implements Trip {
  private route: Route = null;
  private departureTime: number;
  private redefinedProps: Record<string, OptionalTripStop> = {};

  init(route: Route, departureTime: number): Trip {
    super.initStore(TYPES.Trip);
    this.route = route;
    this.departureTime = departureTime;
    return this;
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
    for(let prop of Object.keys(props)) {
      if(this.redefinedProps[id]?.[prop]) {
        delete this.redefinedProps[id][prop];
      }
    }
  }

  getStops(): TripStop[] {
    return this.route.getStops().map(stop => ({
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
        this.departureTime + stop.getDepartureTime()
    }));
  }

  getRoute(): Route {
    return this.route;
  }

  persist(): Object {
    return {};
  }

  persistDeep(): Object {
    return {};
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(null, 0);
  }
}
