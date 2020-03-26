import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Station } from './Station';
import { RouteStop } from './RouteStop';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../TYPES';

export class ActualRouteStop extends ActualBaseStorable implements RouteStop {
  private station: Station;

  init(station: Station): RouteStop {
    super.initStore(TYPES.RouteStop);
    this.station = station;
    return this;
  }

  getStationName(): string {
    return this.station.getName();
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'RouteStop',
      station: this.station.getId()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(store.get(obj.station) as Station);
  }
}
