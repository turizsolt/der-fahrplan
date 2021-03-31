import { TrackCurve } from './TrackCurve';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { TrackSwitchRenderer } from '../../structs/Renderers/TrackSwitchRenderer';
import { TYPES } from '../../di/TYPES';
import { TrackSwitch } from './TrackSwitch';
import { ActualTrackBase } from './ActualTrackBase';
import { injectable, inject } from 'inversify';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Ray } from '../../structs/Geometry/Ray';
import { Left, Right } from '../../structs/Geometry/Directions';
import { Store } from '../../structs/Interfaces/Store';
import { ActualTrackSegment } from './ActualTrackSegment';

@injectable()
export class ActualTrackSwitch extends ActualTrackBase implements TrackSwitch {
  private segmentL: ActualTrackSegment; // A-B
  private segmentR: ActualTrackSegment; // A-C
  private activeSegment: ActualTrackSegment;
  private state: number;

  @inject(TYPES.TrackSwitchRenderer) private renderer: TrackSwitchRenderer;

  init(coordinates1: Coordinate[], coordinates2: Coordinate[]): TrackSwitch {
    super.initStore(TYPES.TrackSwitch);

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

    // decides which is the left one
    if (
      tempE
        .getLineSegmentChain()
        .copyMove(Right, 1)
        .isIntersectsWithChain(tempF.getLineSegmentChain().copyMove(Left, 1))
    ) {
      this.segmentL = new ActualTrackSegment().init(
        this,
        tempE.getCoordinates(),
        [] // todo 4
      );
      this.segmentR = new ActualTrackSegment().init(
        this,
        tempF.getCoordinates(),
        []
      );
    } else {
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

    this.activeSegment = this.segmentL;

    // todo emit
    this.renderer.init(this);

    return this;
  }

  getState(): number {
    return this.state;
  }

  switch() {
    if (this.checkedList.length > 0) return;

    this.state = 1 - this.state;

    if (this.state) {
      this.activeSegment = this.segmentR;
    } else {
      this.activeSegment = this.segmentL;
    }

    // todo emit
    this.renderer.update();
  }

  remove(): boolean {
    const removable = super.remove();
    if (removable) {
      this.segmentL.remove();
      this.segmentR.remove();
      this.renderer.remove();
      this.store.unregister(this);
    }
    return removable;
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
      type: 'TrackSwitch'

      // segmentE: this.segmentE.persist(),
      // segmentF: this.segmentF.persist()
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(
      obj.segmentE.map(a => new Coordinate(a.x, a.y, a.z)),
      obj.segmentF.map(a => new Coordinate(a.x, a.y, a.z))
    );
  }

  // todo needs only for rendering, not for the model
  naturalSplitPoints(): Ray[] {
    const chainE = this.segmentL.getCurve().getLineSegmentChain();
    const chainF = this.segmentR.getCurve().getLineSegmentChain();

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
