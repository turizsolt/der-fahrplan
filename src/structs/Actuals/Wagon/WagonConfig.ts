import { WagonControlType } from './WagonControl/WagonControlType';
import { WagonConnectable } from './WagonConnectable';

export type WagonConfig = {
  maxSpeed: number;
  accelerateBy: number;
  controlType: WagonControlType;
  passengerArrangement: { rows: number; seats: number };
  appearanceId: string;
  length: number;
  connectable: {
    A: WagonConnectable;
    B: WagonConnectable;
  };
};
