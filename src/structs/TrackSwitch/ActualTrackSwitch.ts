import { TrackSwitchEnd } from './TrackSwitchEnd';
import { TrackEnd } from '../Track/TrackEnd';
import { TrackSegment } from '../TrackBase/TrackSegment';
import { Coordinate } from '../Geometry/Coordinate';
import { TrackSwitchRenderer } from './TrackSwitchRenderer';
import { TYPES } from '../TYPES';
import { TrackSwitch } from './TrackSwitch';
import { ActualTrackBase } from '../TrackBase/ActualTrackBase';
import { injectable, inject } from 'inversify';
import { WhichEnd } from '../Track/WhichEnd';
import { Store } from '../Store/Store';

@injectable()
export class ActualTrackSwitch extends ActualTrackBase implements TrackSwitch {
  protected D: TrackEnd;
  protected E: TrackSwitchEnd;
  protected F: TrackSwitchEnd;

  protected segmentE: TrackSegment;
  protected segmentF: TrackSegment;

  getA() {
    return this.D;
  }

  getB() {
    return this.state ? this.F : this.E;
  }

  private state: number;
  @inject(TYPES.TrackSwitchRenderer) private renderer: TrackSwitchRenderer;

  @inject(TYPES.FactoryOfStore) StoreFactory: () => Store;
  private store: Store;

  init(coordinates1: Coordinate[], coordinates2: Coordinate[]): TrackSwitch {
    this.store = this.StoreFactory();
    this.id = this.store.register(this);

    this.D = new TrackEnd(WhichEnd.A, this);
    this.E = new TrackSwitchEnd(WhichEnd.B, this);
    this.F = new TrackSwitchEnd(WhichEnd.B, this);

    const last1 = coordinates1.length - 1;
    const last2 = coordinates2.length - 1;
    if (coordinates1[0].equalsTo(coordinates2[0])) {
      this.segmentE = new TrackSegment(coordinates1);
      this.segmentF = new TrackSegment(coordinates2);
    } else if (coordinates1[last1].equalsTo(coordinates2[last2])) {
      this.segmentE = new TrackSegment(coordinates1.reverse());
      this.segmentF = new TrackSegment(coordinates2.reverse());
    } else if (coordinates1[0].equalsTo(coordinates2[last2])) {
      this.segmentE = new TrackSegment(coordinates1);
      this.segmentF = new TrackSegment(coordinates2.reverse());
    } else if (coordinates1[last1].equalsTo(coordinates2[0])) {
      this.segmentE = new TrackSegment(coordinates1.reverse());
      this.segmentF = new TrackSegment(coordinates2);
    } else {
      throw new Error('Segments has no meeting point');
    }

    this.state = 0;
    this.E.setActive(true);
    this.F.setActive(false);

    this.renderer.init(this);

    return this;
  }

  switch() {
    if (this.checkedList.length > 0) return;

    this.state = 1 - this.state;

    if (this.state) {
      this.E.setActive(false);
      this.F.setActive(true);
    } else {
      this.E.setActive(true);
      this.F.setActive(false);
    }

    this.renderer.update();
  }

  remove(): boolean {
    const removable = super.remove();
    //console.log('remTS', removable);
    if (removable) {
      this.D.remove();
      this.E.remove();
      this.F.remove();
      this.renderer.update();
    }
    return removable;
  }

  getSegmentE(): TrackSegment {
    return this.segmentE;
  }

  getSegmentF(): TrackSegment {
    return this.segmentF;
  }

  getSegment(): TrackSegment {
    return this.state ? this.segmentE : this.segmentF;
  }

  getE(): TrackSwitchEnd {
    return this.E;
  }

  getF(): TrackSwitchEnd {
    return this.F;
  }

  getState(): number {
    return this.state;
  }

  update(): void {
    this.renderer.update();
  }

  verbose(): void {
    // console.log('switch ', this.id, '(hash, conn, phis, joint)');
    // console.log(
    //   'A ',
    //   this.D.getHash(),
    //   !!this.D.connectedToEnd && this.D.connectedToEnd.getHash(),
    //   !!this.D.getJointTo() && this.D.getJointTo().getId()
    // );
    // console.log(
    //   'E ',
    //   this.E.getHash(),
    //   !!this.E.connectedToEnd && this.E.connectedToEnd.getHash(),
    //   !!this.E.phisicallyCconnectedToEnd &&
    //     this.E.phisicallyCconnectedToEnd.getHash(),
    //   !!this.E.getJointTo() && this.E.getJointTo().getId()
    // );
    // console.log(
    //   'F ',
    //   this.F.getHash(),
    //   !!this.F.connectedToEnd && this.F.connectedToEnd.getHash(),
    //   !!this.F.phisicallyCconnectedToEnd &&
    //     this.F.phisicallyCconnectedToEnd.getHash(),
    //   !!this.F.getJointTo() && this.F.getJointTo().getId()
    // );
    // console.log('/switch');
  }
}
