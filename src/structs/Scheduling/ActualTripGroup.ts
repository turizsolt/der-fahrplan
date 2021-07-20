import { ActualBaseStorable } from '../Actuals/ActualStorable';
import { Store } from '../Interfaces/Store';
import { TYPES } from '../../di/TYPES';
import { Trip } from './Trip';
import { TripGroup } from './TripGroup';

export class ActualTripGroup extends ActualBaseStorable implements TripGroup {
  private headway: number;
  private trips: Trip[];

  init(headway: number, trips: Trip[]): TripGroup {
    super.initStore(TYPES.TripGroup);
    this.headway = headway;
    this.trips = trips;
    this.trips.sort((a, b) => a.getDepartureTime() - b.getDepartureTime());
    return this;
  }

  getHeadway(): number {
    return this.headway;
  }

  getTrips(): Trip[] {
    return this.trips;
  }

  persist(): Object {
    return {
      id: this.id,
      type: 'TripGroup',
      headway: this.headway,
      trips: this.trips.map(t => t.getId())
    };
  }

  persistDeep(): Object {
    return {
      id: this.id,
      type: 'TripGroup',
      headway: this.headway,
      trips: this.trips.map(t => t.persistDeep()),
      departureTime: this.trips?.[0].getDepartureTime()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    const trips: Trip[] = obj.trips.map(t => store.get(t) as Trip);
    this.init(obj.headway, trips);
  }
}
