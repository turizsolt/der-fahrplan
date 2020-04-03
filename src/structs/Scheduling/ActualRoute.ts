import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Route } from './Route';
import { RouteStop } from './RouteStop';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../TYPES';

export class ActualRoute extends ActualBaseStorable implements Route {
  private name: string;
  private stops: RouteStop[];

  init(): Route {
    super.initStore(TYPES.Route);
    this.name = this.id;
    this.stops = [];
    return this;
  }

  remove(): void {
    this.store.unregister(this);
  }

  getName(): string {
    return this.name;
  }

  getDetailedName(): string {
    if (this.stops.length === 0) {
      return this.getName() + ' ' + 'Unknown terminus';
    } else if (this.stops.length === 1) {
      return this.getName() + ' ' + this.stops[0].getStationName();
    } else {
      const last = this.stops[this.stops.length - 1];
      return (
        this.getName() +
        ' ' +
        this.stops[0].getStationName() +
        '>>' +
        last.getStationName()
      );
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
      stops: this.stops.map(x => x.getId())
    };
  }

  persistDeep(): Object {
    return {
      id: this.id,
      type: 'Route',
      name: this.name,
      detailedName: this.getDetailedName(),
      stops: this.stops.map(x => x.persistDeep())
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
  }
}
