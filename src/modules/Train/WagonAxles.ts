import { TrackDirection } from '../Track/TrackDirection';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { PositionOnTrack2 } from './PositionOnTrack2';

export interface WagonAxles {
  setAxlePosition(whichEnd: WhichEnd, pot: PositionOnTrack2): void;
  setFacing(facing: TrackDirection): void;
  getAxlePosition(whichEnd: WhichEnd): PositionOnTrack2;
  getFacing(): TrackDirection;
}
