import { TrackBase } from '../Track/TrackBase';
import { TrackDirection } from '../Track/TrackDirection';
import { DirectedTrack } from '../Track/DirectedTrack';

export class PositionOnTrack2 {
  private directedTrack: DirectedTrack;

  constructor(
    track: TrackBase,
    private position: number,
    private direction: TrackDirection
  ) {
    this.directedTrack = track.getDirected(direction);
  }

  reverse(): void {
    this.direction =
      this.direction === TrackDirection.AB
        ? TrackDirection.BA
        : TrackDirection.AB;

    this.position = this.directedTrack.getLength() - this.position;
  }

  getPosition(): number {
    return this.position;
  }

  getDirection(): TrackDirection {
    return this.direction;
  }

  getTrack(): TrackBase {
    return this.directedTrack.getTrack();
  }

  move(distance: number): void {
    if (this.position + distance > this.directedTrack.getLength()) {
      if (this.directedTrack.next()) {
        const tillEnd = this.directedTrack.getLength() - this.position;
        this.directedTrack = this.directedTrack.next();
        this.position = 0;
        this.move(distance - tillEnd);
      } else {
        this.position = this.directedTrack.getLength();
      }
    } else {
      this.position += distance;
    }
  }
}
