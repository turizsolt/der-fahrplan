import { Platform } from '../../structs/Interfaces/Platform';
import { TrackBase } from './TrackBase';
import { injectable } from 'inversify';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { Wagon } from '../../structs/Interfaces/Wagon';

@injectable()
export abstract class ActualTrackBase extends ActualBaseBrick
  implements TrackBase {
  protected checkedList: Wagon[] = [];
  protected platformsBeside: Platform[] = [];

  abstract getRenderer(): BaseRenderer;

  getPlatformsBeside() {
    return this.platformsBeside;
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
    this.platformsBeside.push(platform);
  }

  remove(): boolean {
    return this.isRemovable();
  }

  isRemovable(): boolean {
    return this.checkedList.length === 0;
  }

  update(): void {}
}
