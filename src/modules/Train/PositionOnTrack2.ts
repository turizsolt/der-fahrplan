import { TrackBase } from '../Track/TrackBase';
import { TrackDirection } from '../Track/TrackDirection';
import { DirectedTrack } from '../Track/DirectedTrack';
import { Circle } from '../../structs/Geometry/Circle';
import { Coordinate } from '../../structs/Geometry/Coordinate';

export class PositionOnTrack2 {
  private directedTrack: DirectedTrack;

  constructor(
    track: TrackBase,
    private position: number,
    direction: TrackDirection
  ) {
    this.directedTrack = track.getDirected(direction);
  }

  reverse(): void {
    this.directedTrack = this.directedTrack.reverse();
    this.position = this.directedTrack.getLength() - this.position;
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

  hop(distance: number, prevPoint?: Coordinate): void {
    const lastPoint = this.directedTrack
      .getSegment()
      .getCurve()
      .getLastPoint();
    const bezier = this.directedTrack
      .getSegment()
      .getCurve()
      .getBezier();
    const point =
      prevPoint ||
      bezier.getPoint(this.position / this.getDirectedTrack().getLength());
    const circle = new Circle(point, distance);

    if (lastPoint.distance2d(point) < distance) {
      this.directedTrack = this.directedTrack.next();
      this.position = 0;
      this.hop(distance, point);
    } else {
      let fun = t => t > this.position;
      const vals = bezier
        .intersectWithCircle(circle)
        .map(t => t * this.getDirectedTrack().getLength())
        .filter(fun);
      this.position = vals[0];
    }
  }

  // getters

  getPosition(): number {
    return this.position;
  }

  getTrack(): TrackBase {
    return this.directedTrack.getTrack();
  }

  getDirectedTrack(): DirectedTrack {
    return this.directedTrack;
  }
}
