import { WagonConnectable } from './WagonConnectable';
import { TrackDirection } from '../../../modules/Track/TrackDirection';

export type WagonConfig = {
  maxSpeed: number;
  accelerateBy: number;
  control: {
    A: boolean;
    B: boolean;
  };
  engine: boolean;
  passengerArrangement: { rows: number; seats: number };
  appearanceId: string;
  appearanceFacing: TrackDirection;
  length: number;
  connectable: {
    A: WagonConnectable;
    B: WagonConnectable;
  };
};
