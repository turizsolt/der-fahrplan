import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { TrackDirection } from '../Track/TrackDirection';
import { PositionOnTrack2 } from './PositionOnTrack2';
import { WagonAxles } from './WagonAxles';

export class ActualWagonAxles implements WagonAxles {
  private positions: Record<WhichEnd, PositionOnTrack2> = { A: null, B: null };
  private facing: TrackDirection = TrackDirection.AB;

  setAxlePosition(whichEnd: WhichEnd, pot: PositionOnTrack2): void {
    this.positions[whichEnd] = pot;
  }

  setFacing(facing: TrackDirection): void {
    this.facing = facing;
  }

  getAxlePosition(whichEnd: WhichEnd): PositionOnTrack2 {
    return this.positions[whichEnd];
  }

  getFacing(): TrackDirection {
    return this.facing;
  }
}
