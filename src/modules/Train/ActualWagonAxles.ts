import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { TrackDirection } from '../Track/TrackDirection';
import { PositionOnTrack } from './PositionOnTrack';
import { WagonAxles } from './WagonAxles';

export class ActualWagonAxles implements WagonAxles {
  private positions: Record<WhichEnd, PositionOnTrack> = { A: null, B: null };
  private facing: TrackDirection = TrackDirection.AB;

  setAxlePosition(whichEnd: WhichEnd, pot: PositionOnTrack): void {
    this.positions[whichEnd] = pot;
  }

  setFacing(facing: TrackDirection): void {
    this.facing = facing;
  }

  getAxlePosition(whichEnd: WhichEnd): PositionOnTrack {
    return this.positions[whichEnd];
  }

  getFacing(): TrackDirection {
    return this.facing;
  }

  reverse(): void {
    this.facing =
      this.facing === TrackDirection.AB ? TrackDirection.BA : TrackDirection.AB;
    this.positions = {
      A: this.positions[WhichEnd.B],
      B: this.positions[WhichEnd.A]
    };
    this.positions.A.reverse();
    this.positions.B.reverse();
  }
}
