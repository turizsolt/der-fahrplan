import { Engine } from '../Engine/Engine';
import { Platform } from '../Platform';
import { TrackEnd } from '../Track/TrackEnd';
import { TrackSegment } from './TrackSegment';
import { Coordinate } from '../Coordinate';

export abstract class TrackBase {
  readonly A: TrackEnd;
  readonly B: TrackEnd;
  readonly I: Coordinate;
  readonly segment: TrackSegment;
  protected checkedList: Engine[] = [];
  private _platformList: Platform[] = [];
  get platformList() {
    return this._platformList;
  }

  checkin(engine: Engine) {
    this.checkedList.push(engine);
  }

  checkout(engine: Engine) {
    this.checkedList = this.checkedList.filter(elem => elem !== engine);
  }

  addPlatform(platform: Platform) {
    this._platformList.push(platform);
  }
}
