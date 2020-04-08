import { PositionOnTrack } from '../Track/PositionOnTrack';
import { WhichEnd, otherEnd } from '../../Interfaces/WhichEnd';
import { End } from '../End';
import { Wagon } from '../../Interfaces/Wagon';

export class WagonEnd extends End<Wagon> {
  public positionOnTrack: PositionOnTrack;

  connect(otherEnd: WagonEnd): boolean {
    const successful: boolean = super.connect(otherEnd);
    if (successful) {
      const train = this.endOf.getTrain();
      const otherTrain = otherEnd.getEndOf().getTrain();
      if (train !== otherTrain) {
        train.mergeWith(otherTrain);
      }
    }
    return successful;
  }

  disconnect(): boolean {
    const successful: boolean = super.disconnect();
    if (successful) {
      const train = this.endOf.getTrain();
      const wagonsToSeparate = [];
      let end: WagonEnd = this;
      while (end) {
        wagonsToSeparate.push(end.endOf);
        end = end.getOppositeEnd().getConnectedEnd();
      }
      train.separateThese(wagonsToSeparate);
    }
    return successful;
  }

  getOppositeEnd(): WagonEnd {
    return this.endOf.getEnd(otherEnd(this.whichEnd));
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
