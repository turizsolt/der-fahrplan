import { PositionOnTrack } from '../Track/PositionOnTrack';
import { WhichEnd } from '../../Interfaces/WhichEnd';
import { End } from '../End';
import { Wagon } from '../../Interfaces/Wagon';

export class WagonEnd extends End<Wagon> {
  public positionOnTrack: PositionOnTrack;

  getPositionOnTrack() {
    return this.positionOnTrack;
  }

  getConnectedEnd(): WagonEnd {
    return this.connectedEnd as WagonEnd;
  }

  isSwitchingDirections(): boolean {
    if (!this.getConnectedEnd()) return null;
    return (
      this.getPositionOnTrack().getDirection() !==
      this.getConnectedEnd()
        .getPositionOnTrack()
        .getDirection()
    );
  }

  swapDirection() {
    this.positionOnTrack.swapDirection();
    this.whichEnd = this.whichEnd === WhichEnd.A ? WhichEnd.B : WhichEnd.A;
  }
}
