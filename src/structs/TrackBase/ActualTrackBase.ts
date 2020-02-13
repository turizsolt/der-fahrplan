import { Engine } from '../Engine/Engine';
import { Platform } from '../Platform';
import { TrackEnd } from '../Track/TrackEnd';
import { TrackSegment } from './TrackSegment';
import { Coordinate } from '../Geometry/Coordinate';
import { TrackBase } from './TrackBase';

export abstract class ActualTrackBase implements TrackBase {
  readonly A: TrackEnd;
  readonly B: TrackEnd;
  readonly I: Coordinate;
  readonly segment: TrackSegment;
  protected checkedList: Engine[] = [];
  private _platformsBeside: Platform[] = [];
  get platformsBeside() {
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
}
