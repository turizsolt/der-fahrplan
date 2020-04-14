import { TrackSwitchEnd } from './TrackSwitchEnd';
import { TrackEnd } from './TrackEnd';
import { TrackSegment } from './TrackSegment';
import { Coordinate } from '../../Geometry/Coordinate';
import { TrackSwitchRenderer } from '../../Renderers/TrackSwitchRenderer';
import { TYPES } from '../../../di/TYPES';
import { TrackSwitch } from '../../Interfaces/TrackSwitch';
import { ActualTrackBase } from './ActualTrackBase';
import { injectable, inject } from 'inversify';
import { WhichEnd } from '../../Interfaces/WhichEnd';
import { BaseRenderer } from '../../Renderers/BaseRenderer';
import { Ray } from '../../Geometry/Ray';
import { Left, Right } from '../../Geometry/Directions';
import { Store } from '../../Interfaces/Store';
import { WhichSwitchEnd } from '../../Interfaces/WhichTrackEnd';

@injectable()
export class ActualTrackSwitch extends ActualTrackBase implements TrackSwitch {
  protected D: TrackEnd;
  protected E: TrackSwitchEnd;
  protected F: TrackSwitchEnd;

  protected segmentE: TrackSegment;
  protected segmentF: TrackSegment;
  protected segmentLeft: TrackSegment;
  protected segmentRight: TrackSegment;

  getA() {
    return this.D;
  }

  getB() {
    return this.state ? this.F : this.E;
  }

  private state: number;
  @inject(TYPES.TrackSwitchRenderer) private renderer: TrackSwitchRenderer;

  init(coordinates1: Coordinate[], coordinates2: Coordinate[]): TrackSwitch {
    super.initStore(TYPES.TrackSwitch);

    this.D = new TrackEnd(WhichEnd.A, this);
    this.E = new TrackSwitchEnd(WhichEnd.B, WhichSwitchEnd.E, this);
    this.F = new TrackSwitchEnd(WhichEnd.B, WhichSwitchEnd.F, this);

    const last1 = coordinates1.length - 1;
    const last2 = coordinates2.length - 1;
    let tempE: TrackSegment, tempF: TrackSegment;
    if (coordinates1[0].equalsTo(coordinates2[0])) {
      tempE = new TrackSegment(coordinates1);
      tempF = new TrackSegment(coordinates2);
    } else if (coordinates1[last1].equalsTo(coordinates2[last2])) {
      tempE = new TrackSegment(coordinates1.reverse());
      tempF = new TrackSegment(coordinates2.reverse());
    } else if (coordinates1[0].equalsTo(coordinates2[last2])) {
      tempE = new TrackSegment(coordinates1);
      tempF = new TrackSegment(coordinates2.reverse());
    } else if (coordinates1[last1].equalsTo(coordinates2[0])) {
      tempE = new TrackSegment(coordinates1.reverse());
      tempF = new TrackSegment(coordinates2);
    } else {
      throw new Error('Segments has no meeting point');
    }

    this.segmentE = tempE;
    this.segmentF = tempF;

    if (
      tempE
        .getLineSegmentChain()
        .copyMove(Right, 1)
        .isIntersectsWithChain(tempF.getLineSegmentChain().copyMove(Left, 1))
    ) {
      this.segmentLeft = tempE;
      this.segmentRight = tempF;
    } else {
      this.segmentLeft = tempF;
      this.segmentRight = tempE;
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
      this.renderer.remove();
      this.store.unregister(this);
    }
    return removable;
  }

  getSegmentE(): TrackSegment {
    return this.segmentE;
  }

  getSegmentF(): TrackSegment {
    return this.segmentF;
  }

  getSegmentLeft(): TrackSegment {
    return this.segmentLeft;
  }

  getSegmentRight(): TrackSegment {
    return this.segmentRight;
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

  getRenderer(): BaseRenderer {
    return this.renderer;
  }

  persist(): Object {
    return {
      id: this.getId(),
      type: 'TrackSwitch',

      segmentE: this.segmentE.persist(),
      segmentF: this.segmentF.persist()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(
      obj.segmentE.map(a => new Coordinate(a.x, a.y, a.z)),
      obj.segmentF.map(a => new Coordinate(a.x, a.y, a.z))
    );
  }

  getEnd(e: string): TrackEnd {
    if (e === 'E') return this.getE();
    if (e === 'F') return this.getF();
    return super.getEnd(e);
  }

  naturalSplitPoints(): Ray[] {
    const chainE = this.getSegmentLeft().getLineSegmentChain();
    const chainF = this.getSegmentRight().getLineSegmentChain();

    const leftE = chainE.copyMove(Right, 1).getLineSegments();
    const rightF = chainF.copyMove(Left, 1).getLineSegments();

    let peak = new Ray(new Coordinate(0, 0, 0), 0);

    for (let i of leftE) {
      for (let j of rightF) {
        if (i.isIntersectsWith(j)) {
          peak = new Ray(i.getIntersectionsWith(j)[0], 0);
        }
      }
    }

    const left2E = chainE.copyMove(Right, 2).getLineSegments();
    const right2F = chainF.copyMove(Left, 2).getLineSegments();

    let peak2 = new Ray(new Coordinate(0, 0, 0), 0);

    for (let i of left2E) {
      for (let j of right2F) {
        if (i.isIntersectsWith(j)) {
          peak2 = new Ray(i.getIntersectionsWith(j)[0], 0);
        }
      }
    }

    return [peak, peak2];
  }
}
