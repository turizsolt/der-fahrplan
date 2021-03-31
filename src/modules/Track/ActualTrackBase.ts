import { Platform } from '../../structs/Interfaces/Platform';
import { TrackEnd } from './TrackEnd';
import { TrackCurve } from './TrackCurve';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { TrackBase } from './TrackBase';
import { injectable } from 'inversify';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Wagon } from '../../structs/Interfaces/Wagon';

@injectable()
export abstract class ActualTrackBase extends ActualBaseBrick
  implements TrackBase {
  protected A: TrackEnd;
  protected B: TrackEnd;
  protected I: Coordinate;
  protected curve: TrackCurve;
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

  getCurve(): TrackCurve {
    return this.curve;
  }

  getA(): TrackEnd {
    return this.A;
  }

  getB(): TrackEnd {
    return this.B;
  }

  getLength(): number {
    return this.getCurve().getLength();
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
