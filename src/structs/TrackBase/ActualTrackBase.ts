import { Engine } from '../Engine/Engine';
import { Platform } from '../Platform/Platform';
import { TrackEnd } from '../Track/TrackEnd';
import { TrackSegment } from './TrackSegment';
import { Coordinate } from '../Geometry/Coordinate';
import { TrackBase } from './TrackBase';
import { injectable } from 'inversify';
import { ActualBaseBrick } from '../Base/ActualBaseBrick';
import { BaseRenderer } from '../Base/BaseRenderer';

@injectable()
export abstract class ActualTrackBase extends ActualBaseBrick
  implements TrackBase {
  protected A: TrackEnd;
  protected B: TrackEnd;
  protected I: Coordinate;
  protected segment: TrackSegment;
  protected checkedList: Engine[] = [];
  protected _platformsBeside: Platform[] = [];
  protected removed: boolean = false;

  abstract getRenderer(): BaseRenderer;

  getPlatformsBeside() {
    return this._platformsBeside;
  }

  checkin(engine: Engine) {
    this.checkedList.push(engine);
  }

  checkout(engine: Engine) {
    this.checkedList = this.checkedList.filter(elem => elem !== engine);
  }

  addPlatform(platform: Platform) {
    this._platformsBeside.push(platform);
  }

  getSegment(): TrackSegment {
    return this.segment;
  }

  getA(): TrackEnd {
    return this.A;
  }

  getB(): TrackEnd {
    return this.B;
  }

  getLength(): number {
    return this.getSegment().getLength();
  }

  remove(): boolean {
    if (this.isRemovable()) {
      this.removed = true;
      return true;
    }
    return false;
  }

  isRemovable(): boolean {
    return this.checkedList.length === 0;
  }

  isRemoved(): boolean {
    return this.removed;
  }

  update(): void {}

  getEnd(e: string): TrackEnd {
    if (e === 'A') return this.getA();
    if (e === 'B') return this.getB();
    return null;
  }
}
