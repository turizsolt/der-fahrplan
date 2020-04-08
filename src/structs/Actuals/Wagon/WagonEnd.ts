import { PositionOnTrack } from '../Track/PositionOnTrack';
import { WhichEnd } from '../../Interfaces/WhichEnd';
import { End } from '../End';
import { Wagon } from '../../Interfaces/Wagon';

export class WagonEnd extends End<Wagon> {
  public positionOnTrack: PositionOnTrack;

  connect(otherEnd: WagonEnd): boolean {
    const successful: boolean = super.connect(otherEnd);
    if (successful) {
      const train = this.endOf.getTrain();
      otherEnd.getEndOf().getTrain();
      otherEnd.getEndOf().setTrain(train);
    }
    return successful;
  }

  disconnect(): boolean {
    const successful: boolean = super.disconnect();
    if (successful) {
      this.endOf.setTrain(undefined);
    }
    return successful;
  }

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
