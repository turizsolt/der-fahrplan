import { Platform } from '../../structs/Interfaces/Platform';
import { TrackBase } from './TrackBase';
import { injectable } from 'inversify';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Wagon } from '../../structs/Interfaces/Wagon';
import { TrackCurve } from './TrackCurve';
import { TrackOcupancy } from './TrackOcupancy';
import { ActualTrackOcupancy } from './ActualTrackOcupancy';

@injectable()
export abstract class ActualTrackBase extends ActualBaseBrick
  implements TrackBase {
  protected ocupancy: TrackOcupancy = new ActualTrackOcupancy();
  protected platformsBeside: Platform[] = [];

  abstract getRenderer(): BaseRenderer;

  getCurve(): TrackCurve {
    throw new Error('Method not implemented.');
  }

  getLength(): number {
    return this.getCurve().getLength();
  }

  addPlatform(platform: Platform) {
    this.platformsBeside.push(platform);
  }

  getPlatformsBeside() {
    return this.platformsBeside;
  }

  checkin(engine: Wagon) {
    this.ocupancy.checkin(engine);
    this.update();
  }

  checkout(engine: Wagon) {
    this.ocupancy.checkout(engine);
    this.update();
  }

  isEmpty(): boolean {
    return this.ocupancy.isEmpty();
  }

  getCheckedList(): Wagon[] {
    return this.ocupancy.getCheckedList();
  }

  remove(): boolean {
    return this.isRemovable();
  }

  isRemovable(): boolean {
    return this.isEmpty();
  }

  update(): void {}
}
