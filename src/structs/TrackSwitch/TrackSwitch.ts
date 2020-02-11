import { TrackSwitchEnd } from './TrackSwitchEnd';
import { TrackBase } from '../TrackBase/TrackBase';
import { TrackEnd } from '../Track/TrackEnd';
import { TrackSegment } from '../TrackBase/TrackSegment';
import { Coordinate } from '../Coordinate';
import { SwitchRenderer } from './SwitchRenderer';
import { babylonContainer } from '../inversify.config';
import { TYPES } from '../TYPES';

export class TrackSwitch extends TrackBase {
  readonly D: TrackEnd;
  readonly E: TrackSwitchEnd;
  readonly F: TrackSwitchEnd;

  readonly IE: Coordinate;
  readonly IF: Coordinate;

  readonly segmentE: TrackSegment;
  readonly segmentF: TrackSegment;

  get A() {
    return this.D;
  }
  get B() {
    return this.state ? this.F : this.E;
  }
  get I() {
    return this.state ? this.IF : this.IE;
  }
  get segment() {
    return this.state ? this.segmentF : this.segmentE;
  }

  readonly id: number;
  private state: number;
  private renderer: SwitchRenderer;

  constructor(
    a: Coordinate,
    b: Coordinate,
    c: Coordinate,
    ib?: Coordinate,
    ic?: Coordinate
  ) {
    super();
    this.id = (Math.random() * 1000000) | 0;
    (window as any).switches.push(this);

    this.D = new TrackEnd(a, this);
    this.E = new TrackSwitchEnd(b, this);
    this.F = new TrackSwitchEnd(c, this);
    if (ib) {
      this.IE = ib;
    }
    if (ic) {
      this.IF = ic;
    }

    this.segmentE = new TrackSegment(a, b, ib, true);
    this.segmentF = new TrackSegment(a, c, ic, true);

    this.state = 0;
    this.E.active = true;
    this.F.active = false;

    this.renderer = babylonContainer.get<SwitchRenderer>(TYPES.SwitchRenderer);
    this.renderer.init(this);
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
}
