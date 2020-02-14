import { TrackSwitchEnd } from './TrackSwitchEnd';
import { TrackEnd } from '../Track/TrackEnd';
import { TrackSegment } from '../TrackBase/TrackSegment';
import { Coordinate } from '../Geometry/Coordinate';
import { TrackSwitchRenderer } from './TrackSwitchRenderer';
import { TYPES } from '../TYPES';
import { TrackSwitch } from './TrackSwitch';
import { ActualTrackBase } from '../TrackBase/ActualTrackBase';
import { injectable, inject } from 'inversify';

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

  private id: number;
  private state: number;
  @inject(TYPES.TrackSwitchRenderer) private renderer: TrackSwitchRenderer;

  init(coordinates1: Coordinate[], coordinates2: Coordinate[]): TrackSwitch {
    this.id = (Math.random() * 1000000) | 0;
    // (window as any).switches.push(this);

    this.D = new TrackEnd(null, this);
    this.E = new TrackSwitchEnd(null, this);
    this.F = new TrackSwitchEnd(null, this);

    this.segmentE = new TrackSegment(coordinates1);
    this.segmentF = new TrackSegment(coordinates2);

    this.state = 0;
    this.E.active = true;
    this.F.active = false;

    this.renderer.init(this);

    return this;
  }

  switch() {
    if (this.checkedList.length > 0) return;

    this.state = 1 - this.state;

    this.renderer.update();

    if (this.state) {
      this.F.reconnect();
      this.E.disconnect();
      this.F.active = true;
      this.E.active = false;
    } else {
      this.E.reconnect();
      this.F.disconnect();
      this.E.active = true;
      this.F.active = false;
    }
  }

  getSegmentE(): TrackSegment {
    return this.segmentE;
  }

  getSegmentF(): TrackSegment {
    return this.segmentF;
  }

  getE(): TrackSwitchEnd {
    return this.E;
  }

  getF(): TrackSwitchEnd {
    return this.F;
  }

  getId(): number {
    return this.id;
  }
}
