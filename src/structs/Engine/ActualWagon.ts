import { inject, injectable } from 'inversify';
import { PositionOnTrack } from './PositionOnTrack';
import { ActualBaseBrick } from '../Base/ActualBaseBrick';
import { BaseRenderer } from '../Base/BaseRenderer';
import { Store } from '../Store/Store';
import { WhichEnd } from '../Track/WhichEnd';
import { End } from '../Track/End';
import { Wagon } from './Wagon';

@injectable()
export class ActualWagon extends ActualBaseBrick implements Wagon {
  init(): Wagon {
    super.initStore();

    this.ends = {
      [WhichEnd.A]: new WagonEnd(WhichEnd.A, this),
      [WhichEnd.B]: new WagonEnd(WhichEnd.B, this)
    };

    return this;
  }

  getA(): WagonEnd {
    return this.ends.A;
  }

  getB(): WagonEnd {
    return this.ends.B;
  }

  private ends: Record<WhichEnd, WagonEnd>;

  getRenderer(): BaseRenderer {
    throw new Error('Method not implemented.');
  }
  persist(): Object {
    throw new Error('Method not implemented.');
  }
  load(obj: Object, store: Store): void {
    throw new Error('Method not implemented.');
  }
  update() {}
}

export class WagonEnd extends End<Wagon> {
  private positionOnTrack: PositionOnTrack;

  getPositionOnTrack() {
    return this.positionOnTrack;
  }
}
