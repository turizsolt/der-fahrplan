import { TrackBase } from '../TrackBase/TrackBase';
import { Platform } from '../Platform/Platform';
import { Engine } from './Engine';
import { Ray } from '../Geometry/Ray';
import { TrackEnd } from '../Track/TrackEnd';

export class PositionOnTrack {
  constructor(
    private track: TrackBase,
    private engine: Engine,
    private position: number = 0,
    private direction: number = 1
  ) {
    this.position = position * track.getSegment().getLength();
  }

  move(distance: number) {
    const product = this.direction * distance;
    if (product !== 0) {
      if (product > 0) {
        this.moveTowardsB();
      } else {
        this.moveTowardsA();
      }
    }
  }

  getTrack() {
    return this.track;
  }

  getRay(): Ray {
    return this.track
      .getSegment()
      .getBezier()
      .getRay(this.getPercentage());
  }

  isBeside(platform: Platform): boolean {
    return platform.isBeside(this.position);
  }

  private getPercentage(): number {
    return this.position / this.track.getLength();
  }

  private moveTowardsA(): void {
    this.position -= 1;

    if (this.position < 0) {
      const end = this.track.getA();
      if (end.hasConnectedEndOf()) {
        this.moveNextOnA(end);
      } else {
        this.stopOnA();
      }
    }
  }

  private moveTowardsB(): void {
    this.position += 1;

    const trackLength = this.track.getLength();
    if (this.position > trackLength) {
      const end = this.track.getB();
      if (end.hasConnectedEndOf()) {
        this.moveNextOnB(end, trackLength);
      } else {
        this.stopOnB();
      }
    }
  }

  private moveNextOnA(end: TrackEnd) {
    this.moveToNextTrack(end);
    if (end.isSwitchingEnds()) {
      this.movePositionAB();
    } else {
      this.movePositionAA();
    }
  }

  private moveNextOnB(end: TrackEnd, oldTrackLength: number) {
    this.moveToNextTrack(end);
    if (end.isSwitchingEnds()) {
      this.movePositionBA(oldTrackLength);
    } else {
      this.movePositionBB(oldTrackLength);
    }
  }

  private moveToNextTrack(end: TrackEnd) {
    this.track.checkout(this.engine);
    this.track = end.getConnectedEndOf();
    this.track.checkin(this.engine);
  }

  private movePositionAA() {
    const overRun = -this.position;
    this.position = overRun;
    this.direction = -this.direction;
  }

  private movePositionAB() {
    this.position += this.track.getLength();
  }

  private movePositionBA(oldTrackLength: number) {
    this.position -= oldTrackLength;
  }

  private movePositionBB(oldTrackLength: number) {
    const overRun = this.position - oldTrackLength;
    this.position = this.track.getLength() - overRun;
    this.direction = -this.direction;
  }

  private stopOnA() {
    this.position = 0;
  }

  private stopOnB() {
    this.position = this.track.getLength();
  }
}
