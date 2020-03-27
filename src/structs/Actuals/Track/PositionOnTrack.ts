import { TrackBase } from '../../Interfaces/TrackBase';
import { Platform } from '../../Interfaces/Platform';
import { Ray } from '../../Geometry/Ray';
import { TrackEnd } from './TrackEnd';
import { Circle } from '../../Geometry/Circle';

export class PositionOnTrack {
  private percentage: number;
  constructor(
    private track: TrackBase,
    private position: number = 0,
    private direction: number = 1
  ) {
    this.percentage = position;
    this.position = position * track.getSegment().getLength();
  }

  swapDirection() {
    this.direction = -this.direction;
  }

  copyFrom(other: PositionOnTrack) {
    this.percentage = other.percentage;
    this.track = other.track;
    this.direction = other.direction;
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

  getDirection(): number {
    return this.direction;
  }

  isBeside(platform: Platform): boolean {
    return platform.isBeside(this.position);
  }

  getPercentage(): number {
    return this.percentage;
    //return this.position / this.track.getLength();
  }

  setPercentage(percentage: number): void {
    this.percentage = percentage;
    //this.position = this.track.getLength() * percentage;
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

  hop(distance: number): TrackBase[] {
    const product = this.direction * distance;
    if (product !== 0) {
      if (product > 0) {
        return this.hopTowardsB(Math.abs(distance));
      } else {
        return this.hopTowardsA(Math.abs(distance));
      }
    }
    return [this.track];
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

  private hopTowardsB(distance): TrackBase[] {
    const ret = [this.track];
    const lastPoint = this.track.getSegment().getLastPoint();

    let bezier = this.track.getSegment().getBezier();
    const point = bezier.getPoint(this.getPercentage());
    let fun = t => t > this.getPercentage();

    if (lastPoint.distance2d(point) < distance) {
      if (this.track.getB().hasConnectedEndOf()) {
        if (!this.track.getB().isSwitchingEnds()) {
          this.direction = -this.direction;
        }
        const nextTrack = this.moveToNextTrack(this.track.getB());
        ret.push(nextTrack);
        bezier = this.track.getSegment().getBezier();
        fun = t => true;
      } else {
        this.setPercentage(1);
        return ret;
      }
    }

    const circle = new Circle(point, distance);
    const vals = bezier.intersectWithCircle(circle).filter(fun);
    this.setPercentage(vals[0]);
    return ret;
  }

  private hopTowardsA(distance): TrackBase[] {
    const ret = [this.track];
    const firstPoint = this.track.getSegment().getFirstPoint();

    let bezier = this.track.getSegment().getBezier();
    const point = bezier.getPoint(this.getPercentage());
    let fun = t => t < this.getPercentage();

    if (firstPoint.distance2d(point) < distance) {
      if (this.track.getA().hasConnectedEndOf()) {
        if (!this.track.getA().isSwitchingEnds()) {
          this.direction = -this.direction;
        }
        const nextTrack = this.moveToNextTrack(this.track.getA());
        ret.push(nextTrack);
        bezier = this.track.getSegment().getBezier();
        fun = t => true;
      } else {
        this.setPercentage(0);
        return ret;
      }
    }

    const circle = new Circle(point, distance);
    const vals = bezier.intersectWithCircle(circle);
    const vals2 = vals.filter(fun);
    this.setPercentage(vals2[0]);
    return ret;
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
    this.track = end.getConnectedEndOf();
    return this.track;
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
