import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Route } from './Route';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Trip } from './Trip';

export class ActualTrip extends ActualBaseStorable implements Trip {
  private route: Route = null;

  init(route: Route, startTime: number): Trip {
    super.initStore(TYPES.Trip);
    this.route = route;
    return this;
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
