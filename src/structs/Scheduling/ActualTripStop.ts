import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Station } from './Station';
import { RouteStop } from './RouteStop';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Platform } from '../Interfaces/Platform';

export class ActualTripStop extends ActualBaseStorable implements RouteStop {
  private station: Station;
  private platform: Platform;

  init(station: Station, platform?: Platform): RouteStop {
    super.initStore(TYPES.RouteStop);
    this.station = station;
    this.platform = platform;
    return this;
  }

  getStationName(): string {
    return this.station.getName();
  }

  getStation(): Station {
    return this.station;
  }

  getPlatform(): Platform {
    return this.platform;
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'TripStop',
      station: this.station.getId(),
      platform: this.platform && this.platform.getId()
    };
  }

  persistDeep(): Object {
    return {
      id: this.id,
      type: 'TripStop',
      station: this.station.persistDeep(),
      stationName: this.getStationName(),
      rgbColor: this.station.getColor().getRgbString(),
      platform: this.platform && this.platform.getId()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(
      store.get(obj.station) as Station,
      obj.platform ? (store.get(obj.platform) as Platform) : undefined
    );
  }
}
