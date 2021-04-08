import { TrackDirection } from '../Track/TrackDirection';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { PositionOnTrack } from './PositionOnTrack';

export interface WagonAxles {
  setAxlePosition(whichEnd: WhichEnd, pot: PositionOnTrack): void;
  setFacing(facing: TrackDirection): void;
  getAxlePosition(whichEnd: WhichEnd): PositionOnTrack;
  getFacing(): TrackDirection;
  reverse(): void;
}
