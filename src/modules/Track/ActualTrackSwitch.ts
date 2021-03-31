import { TrackSwitchEnd } from './TrackSwitchEnd';
import { TrackEnd } from './TrackEnd';
import { TrackCurve } from './TrackCurve';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { TrackSwitchRenderer } from '../../structs/Renderers/TrackSwitchRenderer';
import { TYPES } from '../../di/TYPES';
import { TrackSwitch } from './TrackSwitch';
import { ActualTrackBase } from './ActualTrackBase';
import { injectable, inject } from 'inversify';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Ray } from '../../structs/Geometry/Ray';
import { Left, Right } from '../../structs/Geometry/Directions';
import { Store } from '../../structs/Interfaces/Store';
import { WhichSwitchEnd } from '../../structs/Interfaces/WhichTrackEnd';
import { ActualTrackSegment } from './ActualTrackSegment';

@injectable()
export class ActualTrackSwitch extends ActualTrackBase implements TrackSwitch {
  // todo should remove
  protected D: TrackEnd;
  protected E: TrackSwitchEnd;
  protected F: TrackSwitchEnd;

  // todo should remove
  protected segmentE: TrackCurve;
  protected segmentF: TrackCurve;
  protected segmentLeft: TrackCurve;
  protected segmentRight: TrackCurve;

  private segmentL: ActualTrackSegment; // A-B
  private segmentR: ActualTrackSegment; // A-C
  private activeSegment: ActualTrackSegment;

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
    let tempE: TrackCurve, tempF: TrackCurve;
    if (coordinates1[0].equalsTo(coordinates2[0])) {
      tempE = new TrackCurve(coordinates1);
      tempF = new TrackCurve(coordinates2);
    } else if (coordinates1[last1].equalsTo(coordinates2[last2])) {
      tempE = new TrackCurve(coordinates1.reverse());
      tempF = new TrackCurve(coordinates2.reverse());
    } else if (coordinates1[0].equalsTo(coordinates2[last2])) {
      tempE = new TrackCurve(coordinates1);
      tempF = new TrackCurve(coordinates2.reverse());
    } else if (coordinates1[last1].equalsTo(coordinates2[0])) {
      tempE = new TrackCurve(coordinates1.reverse());
      tempF = new TrackCurve(coordinates2);
    } else {
      throw new Error('Segments has no meeting point');
    }

    this.segmentE = tempE;
    this.segmentF = tempF;

    // decides which is the left one
    if (
      tempE
        .getLineSegmentChain()
        .copyMove(Right, 1)
        .isIntersectsWithChain(tempF.getLineSegmentChain().copyMove(Left, 1))
    ) {
      this.segmentLeft = tempE;
      this.segmentRight = tempF;

      this.segmentL = new ActualTrackSegment().init(
        this,
        tempE.getCoordinates(),
        []
      );
      this.segmentR = new ActualTrackSegment().init(
        this,
        tempF.getCoordinates(),
        []
      );
    } else {
      this.segmentLeft = tempF;
      this.segmentRight = tempE;

      this.segmentL = new ActualTrackSegment().init(
        this,
        tempF.getCoordinates(),
        []
      );
      this.segmentR = new ActualTrackSegment().init(
        this,
        tempE.getCoordinates(),
        []
      );
    }

    this.state = 0;
    this.E.setActive(true);
    this.F.setActive(false);

    this.activeSegment = this.segmentL;

    // todo emit
    this.renderer.init(this);

    return this;
  }

  switch() {
    if (this.checkedList.length > 0) return;

    this.state = 1 - this.state;

    if (this.state) {
      this.E.setActive(false);
      this.F.setActive(true);

      this.activeSegment = this.segmentR;
    } else {
      this.E.setActive(true);
      this.F.setActive(false);

      this.activeSegment = this.segmentL;
    }

    // todo emit
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

  getSegmentE(): TrackCurve {
    return this.segmentE;
  }

  getSegmentF(): TrackCurve {
    return this.segmentF;
  }

  getSegmentLeft(): TrackCurve {
    return this.segmentLeft;
  }

  getSegmentRight(): TrackCurve {
    return this.segmentRight;
  }

  getCurve(): TrackCurve {
    return this.state ? this.segmentE : this.segmentF;
  }

  getE(): TrackSwitchEnd {
    return this.E;
  }

  getF(): TrackSwitchEnd {
    return this.F;
  }

  // todo important
  getState(): number {
    return this.state;
  }

  update(): void {
    this.renderer.update();
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

  // todo needs only for rendering, not for the model
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
