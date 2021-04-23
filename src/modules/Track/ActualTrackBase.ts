import { Platform } from '../../structs/Interfaces/Platform';
import { TrackBase } from './TrackBase';
import { injectable } from 'inversify';
import { ActualBaseBrick } from '../../structs/Actuals/ActualBaseBrick';
import { BaseRenderer } from '../../structs/Renderers/BaseRenderer';
import { TrackCurve } from './TrackCurve';
import { TrackOcupancy } from './TrackOcupancy';
import { ActualTrackOcupancy } from './ActualTrackOcupancy';
import { TrackDirection } from './TrackDirection';
import { DirectedTrack } from './DirectedTrack';
import { Train } from '../Train/Train';
import { TrackSegment } from './TrackSegment';

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

  getDirected(direction: TrackDirection): DirectedTrack {
    throw new Error('Method not implemented.');
  }

  getActiveSegment(): TrackSegment {
    throw new Error('Method not implemented.');
  }

  addPlatform(platform: Platform) {
    this.platformsBeside.push(platform);
  }

  getPlatformsBeside() {
    return this.platformsBeside;
  }

  checkin(train: Train) {
    this.ocupancy.checkin(train);
    this.update();
  }

  checkout(train: Train) {
    this.ocupancy.checkout(train);
    this.update();
  }

  isEmpty(): boolean {
    return this.ocupancy.isEmpty();
  }

  getCheckedList(): Train[] {
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
