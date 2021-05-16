import { TrackSwitchRenderer } from '../../structs/Renderers/TrackSwitchRenderer';
import { TYPES } from '../../di/TYPES';
import { TrackSwitch } from './TrackSwitch';
import { ActualTrackBase } from './ActualTrackBase';
import { injectable, inject } from 'inversify';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Store } from '../../structs/Interfaces/Store';
import { ActualTrackSegment } from './ActualTrackSegment';
import { TrackSwitchCoordinates } from './TrackSwitchCoordinates';
import { TrackCurve } from './TrackCurve';
import { TrackSegment } from './TrackSegment';
import { TrackSegmentData } from './TrackSegmentData';
import { TrackDirection } from './TrackDirection';
import { DirectedTrack } from './DirectedTrack';
import { toSegmentData } from './ActualTrack';

@injectable()
export class ActualTrackSwitch extends ActualTrackBase implements TrackSwitch {
  private segmentLeft: TrackSegment; // A-B
  private segmentRight: TrackSegment; // A-C
  private activeSegment: TrackSegment;
  private state: number;
  private locked: boolean = false;

  @inject(TYPES.TrackSwitchRenderer) private renderer: TrackSwitchRenderer;

  init(
    segmentData1: TrackSegmentData,
    segmentData2: TrackSegmentData
  ): TrackSwitch {
    super.initStore(TYPES.TrackSwitch);

    const [seg1, seg2] = TrackSwitchCoordinates.align(
      segmentData1,
      segmentData2
    );
    this.segmentLeft = new ActualTrackSegment(this, seg1);
    this.segmentRight = new ActualTrackSegment(this, seg2);

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
    if (this.locked) return;

    this.state = 1 - this.state;

    this.activeSegment.disconnect();
    this.activeSegment = this.state ? this.segmentRight : this.segmentLeft;
    this.activeSegment.connect();

    // todo emit
    this.renderer.update();
  }

  lock(): void {
    this.locked = true;

    // todo emit
    this.renderer.update();
  }

  unlock(): void {
    this.locked = false;

    // todo emit
    this.renderer.update();
  }

  isLocked(): boolean {
    return this.locked;
  }

  getDirected(direction: TrackDirection): DirectedTrack {
    return this.activeSegment.getDirected(direction);
  }

  getActiveSegment(): TrackSegment {
    return this.activeSegment;
  }

  getHash(segment?: TrackSegment): string {
    return this.id + '-' + (segment === this.segmentLeft ? 'Left' : 'Right');
  }

  getCurve(): TrackCurve {
    return this.activeSegment.getCurve();
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
      type: 'TrackSwitch',
      segmentLeftData: this.segmentLeft.persist(),
      segmentRightData: this.segmentRight.persist(),
      state: this.getState(),
      isLocked: this.locked
    };
  }

  load(obj: any, store: Store): void {
    this.presetId(obj.id);
    this.init(
      toSegmentData(obj.segmentLeftData, store),
      toSegmentData(obj.segmentRightData, store)
    );
    if (obj.state === 1) {
      this.switch();
    }
    obj.isLocked ? this.lock() : this.unlock();
    this.update();
  }
}
