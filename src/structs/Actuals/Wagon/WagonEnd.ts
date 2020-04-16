import { PositionOnTrack } from '../Track/PositionOnTrack';
import { WhichEnd, otherEnd } from '../../Interfaces/WhichEnd';
import { End } from '../End';
import { Wagon } from '../../Interfaces/Wagon';
import { Store } from '../../Interfaces/Store';
import { TrackBase } from '../../Interfaces/TrackBase';

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

  persist(): Object {
    return {
      ...super.persist(),
      positionOnTrack: this.positionOnTrack.persist(),
      otherEnd: this.hasConnectedEndOf() && {
        endOf: this.getConnectedEndOf().getId(),
        whichEnd: this.getConnectedEnd().getWhichEnd()
      }
    };
  }

  load(obj: any, store: Store): void {
    this.positionOnTrack = new PositionOnTrack(
      store.get(obj.positionOnTrack.track) as TrackBase,
      obj.positionOnTrack.percentage,
      obj.positionOnTrack.direction
    );
    this.whichEnd = obj.whichEnd;
    this.endOf = store.get(obj.endOf) as Wagon;
    if (obj.otherEnd) {
      const other = store.get(obj.otherEnd.endOf) as Wagon;
      if (other) {
        this.connect(other.getEnd(obj.otherEnd.whichEnd));
      }
    }
  }
}
