import { Engine } from './Engine';
import { Passenger } from '../Actuals/Passenger';
import { Coordinate } from '../Geometry/Coordinate';
import { Color } from '../Color';
import { Side } from './Side';
import { TrackBase } from './TrackBase';
import { BaseBrick } from './BaseBrick';
import { PassengerGenerator } from '../Actuals/PassengerGenerator';
import { LineSegmentChain } from '../Geometry/LineSegmentChain';
import { Station } from '../Scheduling/Station';

export interface Platform extends BaseBrick {
  checkin(engine: Engine): void;
  checkout(engine: Engine): void;
  isChecked(engine: Engine): void;
  addPassenger(passenger: Passenger): void;
  removePassenger(passenger: Passenger): void;
  callForDepartingPassengers(engine: Engine): void;
  isBeside(position: number): boolean;

  getLineSegmentChain(): LineSegmentChain;
  isPartOfStation(station: Station): boolean;
  setStation(station: Station): void;
  getStation(): Station;

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
