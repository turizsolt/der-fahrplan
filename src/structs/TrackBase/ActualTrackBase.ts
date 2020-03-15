import { Platform } from '../Platform/Platform';
import { TrackEnd } from '../Track/TrackEnd';
import { TrackSegment } from './TrackSegment';
import { Coordinate } from '../Geometry/Coordinate';
import { TrackBase } from './TrackBase';
import { injectable } from 'inversify';
import { ActualBaseBrick } from '../Base/ActualBaseBrick';
import { BaseRenderer } from '../Base/BaseRenderer';
import { Wagon } from '../Engine/Wagon';

@injectable()
export abstract class ActualTrackBase extends ActualBaseBrick
  implements TrackBase {
  protected A: TrackEnd;
  protected B: TrackEnd;
  protected I: Coordinate;
  protected segment: TrackSegment;
  protected checkedList: Wagon[] = [];
  protected _platformsBeside: Platform[] = [];
  protected removed: boolean = false;

  abstract getRenderer(): BaseRenderer;

  getPlatformsBeside() {
    return this._platformsBeside;
  }

  checkin(engine: Wagon) {
    this.checkedList.push(engine);
    this.update();
  }

  checkout(engine: Wagon) {
    this.checkedList = this.checkedList.filter(elem => elem !== engine);
    this.update();
  }

  isEmpty(): boolean {
    return this.checkedList.length === 0;
  }

  getCheckedList(): Wagon[] {
    return this.checkedList;
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
