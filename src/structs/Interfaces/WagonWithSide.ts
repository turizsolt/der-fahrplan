import { WhichEnd } from './WhichEnd';
import { Wagon } from './Wagon';

export interface WagonWithSide {
  wagon: Wagon;
  side: WhichEnd;
}

export interface WagonIdWithSide {
  wagonId: string;
  side: WhichEnd;
}
