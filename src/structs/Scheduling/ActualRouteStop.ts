import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Store } from '../Actuals/Store/Store';
import { Station } from './Station';
import { RouteStop } from './RouteStop';

export class ActualRouteStop extends ActualBaseStorable implements RouteStop {
  private station: Station;

  init(station: Station): RouteStop {
    super.initStore();
    this.station = station;
    return this;
  }

  getStationName(): string {
    return this.station.getName();
  }

  persist(): Object {
    throw new Error('Method not implemented.');
  }

  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
}
