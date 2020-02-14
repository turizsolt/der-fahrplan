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
    if (typeof window !== 'undefined') {
      (window as any).switches.push(this);
    }

    this.D = new TrackEnd(WhichEnd.A, this);
    this.E = new TrackSwitchEnd(WhichEnd.B, this);
    this.F = new TrackSwitchEnd(WhichEnd.B, this);

    const last1 = coordinates1.length - 1;
    const last2 = coordinates2.length - 1;
    if (coordinates1[0].equalsTo(coordinates2[0])) {
      this.segmentE = new TrackSegment(coordinates1, true);
      this.segmentF = new TrackSegment(coordinates2, true);
    } else if (coordinates1[last1].equalsTo(coordinates2[last2])) {
      this.segmentE = new TrackSegment(coordinates1.reverse(), true);
      this.segmentF = new TrackSegment(coordinates2.reverse(), true);
    } else {
      throw new Error('Segments has no meeting point');
    }

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

  remove(): void {
    super.remove();
    this.renderer.update();
  }

  getSegmentE(): TrackSegment {
    return this.segmentE;
  }

  getSegmentF(): TrackSegment {
    return this.segmentF;
  }

  getSegment(): TrackSegment {
    return this.state ? this.segmentF : this.segmentE;
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

  getState(): number {
    return this.state;
  }
}
