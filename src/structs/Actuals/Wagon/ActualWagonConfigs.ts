import { WagonConfig } from './WagonConfig';
import { WagonConnectable } from './WagonConnectable';
import { TrackDirection } from '../../../modules/Track/TrackDirection';

const wagon: WagonConfig = {
  maxSpeed: 3,
  accelerateBy: 0.015625,
  control: {
    A: true,
    B: true
  },
  engine: true,
  appearanceFacing: TrackDirection.AB,
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
  accelerateBy: 0.015625,
  control: {
    A: true,
    B: false
  },
  engine: false,
  appearanceFacing: TrackDirection.AB,
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
  accelerateBy: 0.015625,
  control: {
    A: true,
    B: true
  },
  engine: true,
  appearanceFacing: TrackDirection.AB,
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
  accelerateBy: 0.015625,
  control: {
    A: false,
    B: false
  },
  engine: false,
  appearanceFacing: TrackDirection.AB,
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
