import { TrackBase } from '../Track/TrackBase';
import { TrackDirection } from '../Track/TrackDirection';

export class PositionOnTrack2 {
  constructor(
    private track: TrackBase,
    private position: number,
    private direction: TrackDirection
  ) {}

  reverse(): void {
    this.direction =
      this.direction === TrackDirection.AB
        ? TrackDirection.BA
        : TrackDirection.AB;

    this.position = this.track.getLength() - this.position;
  }

  getPosition(): number {
    return this.position;
  }

  getDirection(): TrackDirection {
    return this.direction;
  }
}
