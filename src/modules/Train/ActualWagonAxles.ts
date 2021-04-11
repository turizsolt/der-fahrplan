import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { TrackDirection } from '../Track/TrackDirection';
import { PositionOnTrack } from './PositionOnTrack';
import { WagonAxles } from './WagonAxles';
import { WagonConfig } from '../../structs/Actuals/Wagon/WagonConfig';

export class ActualWagonAxles implements WagonAxles {
  private positions: Record<WhichEnd, PositionOnTrack> = { A: null, B: null };
  private facing: TrackDirection;
  private controls: Record<WhichEnd, boolean>;
  private engine: boolean;

  constructor(config: WagonConfig) {
    this.controls = config.control ?? {A: false, B: false};
    this.engine = config.engine ?? false;
    this.facing = config.appearanceFacing ?? TrackDirection.AB;
  }

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

  hasControl(whichEnd: WhichEnd): boolean {
    return this.controls[whichEnd];
  }

  hasEngine(): boolean {
      return this.engine;
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
    this.controls = {
        A: this.controls.B,
        B: this.controls.A
    }
  }
}
