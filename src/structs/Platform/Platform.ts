import { Engine } from '../Engine/Engine';
import { Passenger } from '../Passenger/Passenger';
import { Coordinate } from '../Geometry/Coordinate';
import { Color } from '../Color';
import { Side } from './Side';
import { TrackBase } from '../TrackBase/TrackBase';
import { BaseBrick } from '../Base/BaseBrick';
import { PassengerGenerator } from './PassengerGenerator';

export interface Platform extends BaseBrick {
  checkin(engine: Engine): void;
  checkout(engine: Engine): void;
  isChecked(engine: Engine): void;
  addPassenger(passenger: Passenger): void;
  removePassenger(passenger: Passenger): void;
  callForDepartingPassengers(engine: Engine): void;
  isBeside(position: number): boolean;

  getWidth(): number;
  getLength(): number;
  getPosition(): Coordinate;
  getRotation(): number;
  getColor(): Color;
  remove(): boolean;
  isRemoved(): boolean;

  init(
    track: TrackBase,
    start: number,
    end: number,
    width: number,
    side: Side,
    color: Color,
    pg: PassengerGenerator
  ): Platform;
}
