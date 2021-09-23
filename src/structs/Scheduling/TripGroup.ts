import { BaseStorable } from '../Interfaces/BaseStorable';
import { Trip } from './Trip';

export interface TripGroup extends BaseStorable {
  init(headway: number, trips: Trip[]): TripGroup;
  getHeadway(): number;
  getTrips(): Trip[];
}
