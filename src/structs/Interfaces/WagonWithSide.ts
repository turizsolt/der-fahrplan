import { WhichEnd } from './WhichEnd';
import { Wagon } from './Wagon';
import { Trip } from '../Scheduling/Trip';

export interface WagonWithSide {
  wagon: Wagon;
  side: WhichEnd;
  trip?: Trip;
}

export interface WagonIdWithSide {
  wagonId: string;
  side: WhichEnd;
}
