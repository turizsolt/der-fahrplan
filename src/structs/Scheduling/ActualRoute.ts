import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Route } from './Route';
import { RouteStop } from './RouteStop';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';

export class ActualRoute extends ActualBaseStorable implements Route {
  private name: string;
  private stops: RouteStop[];
  private reverse: Route;
  private color: string;

  init(): Route {
    super.initStore(TYPES.Route);
    this.name = this.id;
    this.stops = [];
    return this;
  }

  setReverse(route: Route): void {
    this.reverse = route;
    if (route.getReverse() != this) {
      route.setReverse(this);
    }
  }

  getReverse(): Route {
    return this.reverse;
  }

  remove(): void {
    this.store.unregister(this);
  }

  getColor(): string {
    return this.color ?? '#fff';
  }

  setColor(color: string): void {
    this.color = color;
  }

  getName(): string {
    return this.name;
  }

  getDetailedName(): string {
    if (this.stops.length === 0) {
      return 'Unknown terminus';
    } else if (this.stops.length === 1) {
      return this.stops[0].getStationName();
    } else {
      const last = this.stops[this.stops.length - 1];
      return this.stops[0].getStationName() + '>>' + last.getStationName();
    }
  }

  setName(name: string) {
    this.name = name;
  }

  getStops(): any[] {
    return this.stops;
  }

  addStop(stop: RouteStop): void {
    this.stops.push(stop);
  }

  removeStop(stop: RouteStop): void {
    this.stops = this.stops.filter(s => s !== stop);
  }

  swapStopWithPrev(stop: RouteStop): void {
    const index = this.stops.findIndex(s => s === stop);
    if (index !== -1 && index > 0) {
      const tmp0 = this.stops[index - 1];
      const tmp1 = this.stops[index];
      this.stops[index - 1] = tmp1;
      this.stops[index] = tmp0;
    }
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'Route',
      name: this.name,
      detailedName: this.getDetailedName(),
      stops: this.stops.map(x => x.getId()),
      reverse: this.getReverse() && this.getReverse().getId(),
      color: this.color
    };
  }

  persistDeep(): Object {
    return {
      id: this.id,
      type: 'Route',
      name: this.name,
      destination:
        this.stops.length > 0
          ? this.stops[this.stops.length - 1].getStationName()
          : 'Unknown',
      detailedName: this.getDetailedName(),
      stops: this.stops.map((x, ind) => ({
        ...x.persistDeep(),
        isDepartureStation: ind === 0,
        isArrivalStation: ind === this.stops.length - 1
      })),
      reverse: this.getReverse() && this.getReverse().getId(),
      color: this.color
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init();
    this.setName(obj.name);
    for (let stopId of obj.stops) {
      const x = store.get(stopId) as RouteStop;
      this.addStop(x);
    }
    if (obj.reverse && store.get(obj.reverse)) {
      this.setReverse(store.get(obj.reverse) as Route);
    }
    if (obj.color) {
      this.setColor(obj.color);
    }
  }
}
