import { BaseStorable } from '../Interfaces/BaseStorable';
import { Station } from './Station';

export interface RouteStop extends BaseStorable {
  init(station: Station): RouteStop;
  getStationName(): string;
}
