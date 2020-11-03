import { WagonConfig } from './WagonConfig';
import { WagonControlType } from './WagonControl/WagonControlType';
import { WagonConnectable } from './WagonConnectable';

const wagon: WagonConfig = {
  maxSpeed: 3,
  accelerateBy: 0.25,
  controlType: WagonControlType.Locomotive,
  passengerArrangement: { rows: 0, seats: 0 },
  appearanceId: 'wagon',
  length: 14,
  connectable: {
    A: WagonConnectable.Connectable,
    B: WagonConnectable.Connectable
  }
};

const vez: WagonConfig = {
  maxSpeed: 3,
  accelerateBy: 0.25,
  controlType: WagonControlType.ControlCar,
  passengerArrangement: { rows: 7, seats: 3 },
  appearanceId: 'vez',
  length: 14,
  connectable: {
    A: WagonConnectable.Connectable,
    B: WagonConnectable.Connectable
  }
};

const mot: WagonConfig = {
  maxSpeed: 3,
  accelerateBy: 0.25,
  controlType: WagonControlType.Locomotive,
  passengerArrangement: { rows: 7, seats: 3 },
  appearanceId: 'mot',
  length: 14,
  connectable: {
    A: WagonConnectable.Connectable,
    B: WagonConnectable.Connectable
  }
};

const utas: WagonConfig = {
  maxSpeed: 3,
  accelerateBy: 0.25,
  controlType: WagonControlType.Nothing,
  passengerArrangement: { rows: 7, seats: 3 },
  appearanceId: 'utas',
  length: 14,
  connectable: {
    A: WagonConnectable.Connectable,
    B: WagonConnectable.Connectable
  }
};

const library: { [id: string]: WagonConfig } = {
  utas,
  mot,
  vez,
  wagon,
  locomotive: wagon,
  passenger: utas,
  controlCar: vez,
  combined: mot
};

export const getPredefinedWagonConfig = (id: string): WagonConfig => {
  if (library[id]) {
    return library[id];
  }
  return wagon;
};
