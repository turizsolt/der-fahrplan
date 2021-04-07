import { TrackBase } from '../Track/TrackBase';
import { TrackDirection } from '../Track/TrackDirection';
import { DirectedTrack } from '../Track/DirectedTrack';
import { Circle } from '../../structs/Geometry/Circle';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Ray } from '../../structs/Geometry/Ray';

export class PositionOnTrack2 {
  private directedTrack: DirectedTrack;

  constructor(
    track: TrackBase,
    private position: number,
    direction: TrackDirection
  ) {
    this.directedTrack = track.getDirected(direction);
  }

  clone(): PositionOnTrack2 {
    return new PositionOnTrack2(
      this.getTrack(),
      this.getPosition(),
      this.getTrack().getDirected(TrackDirection.AB) === this.getDirectedTrack()
        ? TrackDirection.AB
        : TrackDirection.BA
    );
  }

  getRay(): Ray {
    return this.directedTrack
      .getCurve()
      .getBezier()
      .getRay(this.position / this.directedTrack.getLength());
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
    const lastPoint = this.directedTrack.getCurve().getLastPoint();
    const bezier = this.directedTrack.getCurve().getBezier();
    const point =
      prevPoint ||
      bezier.getPoint(this.position / this.getDirectedTrack().getLength());
    const circle = new Circle(point, distance);

    if (lastPoint.distance2d(point) < distance) {
      if (this.directedTrack.next()) {
        this.directedTrack = this.directedTrack.next();
        this.position = 0;
        this.hop(distance, point);
      } else {
        this.position = this.directedTrack.getLength();
      }
    } else {
      const intersectionPoints = bezier
        .intersectWithCircle(circle)
        .map(t => t * this.getDirectedTrack().getLength())
        .filter(t => t > this.position);
      this.position = intersectionPoints[0];
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
