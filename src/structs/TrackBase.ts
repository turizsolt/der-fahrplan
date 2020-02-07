import * as BABYLON from 'babylonjs';
import { Engine } from './Engine/Engine';
import { Platform } from './Platform';
import { TrackEnd } from './TrackEnd';
import { TrackSegment } from './TrackSegment';

export abstract class TrackBase {
  readonly A: TrackEnd;
  readonly B: TrackEnd;
  readonly I: BABYLON.Vector3;
  readonly segment: TrackSegment;
  abstract render(scene: BABYLON.Scene);
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
