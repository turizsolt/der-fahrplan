import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Route } from './Route';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Trip } from './Trip';
import { TripStop } from './TripStop';

export class ActualTrip extends ActualBaseStorable implements Trip {
  private route: Route = null;
  private departureTime: number;

  init(route: Route, departureTime: number): Trip {
    super.initStore(TYPES.Trip);
    this.route = route;
    this.departureTime = departureTime;
    return this;
  }

  getStops(): TripStop[] {
    return this.route.getStops().map(stop => ({
      station: stop.getStation(),
      platform: stop.getPlatform(),
      stationName: stop.getStationName(),
      arrivalTime: this.departureTime + stop.getArrivalTime(),
      departureTime: this.departureTime + stop.getDepartureTime()
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
