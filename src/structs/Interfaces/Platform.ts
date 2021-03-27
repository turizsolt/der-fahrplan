import { Coordinate } from '../Geometry/Coordinate';
import { Color } from '../Color';
import { Side } from './Side';
import { TrackBase } from '../../modules/Track/TrackBase';
import { LineSegmentChain } from '../Geometry/LineSegmentChain';
import { Station } from '../Scheduling/Station';
import { BaseBrick } from './BaseBrick';
import { Boardable } from '../../mixins/Boardable';

export interface Platform extends BaseBrick, Boardable {
  isBeside(position: number): boolean;

  pseudoBoard(): Coordinate;

  getLineSegmentChain(): LineSegmentChain;
  isPartOfStation(station: Station): boolean;
  setStation(station: Station): void;
  getStation(): Station;

  getWidth(): number;
  getLength(): number;
  getPosition(): Coordinate;
  getRotation(): number;
  getNo(): string;
  getColor(): Color;
  remove(): boolean;
  isRemoved(): boolean;

  init(
    track: TrackBase,
    start: number,
    end: number,
    side: Side,
    width?: number
  ): Platform;

  initX(station: Station, no: string): Platform;
}
