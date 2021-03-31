import { Coordinate } from '../../structs/Geometry/Coordinate';
import { TrackSwitchRenderer } from '../../structs/Renderers/TrackSwitchRenderer';
import { TYPES } from '../../di/TYPES';
import { TrackSwitch } from './TrackSwitch';
import { ActualTrackBase } from './ActualTrackBase';
import { injectable, inject } from 'inversify';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { ActualTrackSegment } from './ActualTrackSegment';
import { TrackSwitchCoordinates } from './TrackSwitchCoordinates';
import { TrackJointEnd } from './TrackJoint/TrackJointEnd';
import { TrackCurve } from './TrackCurve';

@injectable()
export class ActualTrackSwitch extends ActualTrackBase implements TrackSwitch {
  private segmentLeft: ActualTrackSegment; // A-B
  private segmentRight: ActualTrackSegment; // A-C
  private activeSegment: ActualTrackSegment;
  private state: number;

  @inject(TYPES.TrackSwitchRenderer) private renderer: TrackSwitchRenderer;

  init(
    coordinates1: Coordinate[],
    coordinates2: Coordinate[],
    jointEnds: TrackJointEnd[]
  ): TrackSwitch {
    super.initStore(TYPES.TrackSwitch);

    const [coords1, coords2, jes] = TrackSwitchCoordinates.align(
      coordinates1,
      coordinates2,
      jointEnds
    );
    this.segmentLeft = new ActualTrackSegment(this, coords1 as Coordinate[], [
      (jes as TrackJointEnd[])[0],
      (jes as TrackJointEnd[])[1]
    ]);
    this.segmentRight = new ActualTrackSegment(this, coords2 as Coordinate[], [
      (jes as TrackJointEnd[])[2],
      (jes as TrackJointEnd[])[3]
    ]);

    this.state = 0;

    this.activeSegment = this.segmentLeft;
    this.activeSegment.connect();

    // todo emit
    this.renderer.init(this);

    return this;
  }

  getState(): number {
    return this.state;
  }

  switch() {
    if (!this.isEmpty()) return;

    this.state = 1 - this.state;

    this.activeSegment.disconnect();
    if (this.state) {
      this.activeSegment = this.segmentRight;
    } else {
      this.activeSegment = this.segmentLeft;
    }
    this.activeSegment.connect();

    // todo emit
    this.renderer.update();
  }

  getCurve(): TrackCurve {
    return this.activeSegment.getCurve();
  }

  getSegmentE(): TrackCurve {
    return this.segmentLeft.getCurve();
  }

  getSegmentF(): TrackCurve {
    return this.segmentRight.getCurve();
  }

  getSegmentLeft(): TrackCurve {
    return this.segmentLeft.getCurve();
  }

  getSegmentRight(): TrackCurve {
    return this.segmentRight.getCurve();
  }

  remove(): boolean {
    const removable = super.remove();
    if (removable) {
      this.activeSegment.disconnect();
      this.segmentLeft.remove();
      this.segmentRight.remove();
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
    // this.presetId(obj.id);
    // this.init(
    //  obj.segmentE.map(a => new Coordinate(a.x, a.y, a.z)),
    //  obj.segmentF.map(a => new Coordinate(a.x, a.y, a.z))
    // );
  }
}
