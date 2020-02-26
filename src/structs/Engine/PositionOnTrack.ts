import { TrackBase } from '../TrackBase/TrackBase';
import { Platform } from '../Platform';
import { Engine } from './Engine';
import { Ray } from '../Geometry/Ray';

export class PositionOnTrack {
  constructor(
    private track: TrackBase,
    private engine: Engine,
    private position: number = 0,
    private direction: number = 1
  ) {}

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

  private getPercentage(): number {
    return this.position / this.track.getSegment().getLength();
  }

  getRay(): Ray {
    return this.track
      .getSegment()
      .getBezier()
      .getRay(this.getPercentage());
  }

  isBeside(platform: Platform): boolean {
    return platform.start <= this.position && this.position <= platform.end;
  }

  private moveTowardsA(): void {
    this.position -= 1;

    if (this.position < 0) {
      const nextTrackEnd = this.track.getA().getConnectedTrack();
      if (nextTrackEnd) {
        const isConnectedEndIsOpposite =
          this.track
            .getA()
            .getConnectedEnd()
            .getWhichEnd() === 'B';
        this.track.checkout(this.engine);
        this.track = this.track.getA().getConnectedTrack();
        this.track.checkin(this.engine);
        if (isConnectedEndIsOpposite) {
          const prevTrackLength = this.track.getSegment().getLength();
          this.position += prevTrackLength;
        } else {
          const overRun = -this.position;
          this.position = overRun;
          this.direction = -this.direction;
        }
      } else {
        this.position = 0;
      }
    }
  }

  private moveTowardsB(): void {
    this.position += 1;

    const trackLength = this.track.getSegment().getLength();
    if (this.position > trackLength) {
      const nextTrackEnd = this.track.getB().getConnectedTrack();
      if (nextTrackEnd) {
        const isConnectedEndIsOpposite =
          this.track
            .getB()
            .getConnectedEnd()
            .getWhichEnd() === 'A';

        this.track.checkout(this.engine);
        this.track = this.track.getB().getConnectedTrack();
        this.track.checkin(this.engine);

        if (isConnectedEndIsOpposite) {
          this.position -= trackLength;
        } else {
          const overRun = this.position - trackLength;
          this.position = this.track.getSegment().getLength() - overRun;
          this.direction = -this.direction;
        }
      } else {
        this.position = trackLength;
      }
    }
  }
}
