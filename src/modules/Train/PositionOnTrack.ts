import { TrackBase } from '../Track/TrackBase';
import { TrackDirection } from '../Track/TrackDirection';
import { DirectedTrack } from '../Track/DirectedTrack';
import { Circle } from '../../structs/Geometry/Circle';
import { Coordinate } from '../../structs/Geometry/Coordinate';
import { Ray } from '../../structs/Geometry/Ray';
import { PositionData } from './PositionData';
import { Store } from '../../structs/Interfaces/Store';
import { TrackMarker } from '../Track/TrackMarker';

export class PositionOnTrack {
  constructor(private directedTrack: DirectedTrack, private position: number) { }

  static fromTrack(
    track: TrackBase,
    position: number,
    direction: TrackDirection
  ): PositionOnTrack {
    return new PositionOnTrack(track.getDirected(direction), position);
  }

  clone(): PositionOnTrack {
    return new PositionOnTrack(this.getDirectedTrack(), this.getPosition());
  }

  opposition(): PositionOnTrack {
    const op = this.clone();
    op.reverse();
    return op;
  }

  addMarker(marker: TrackMarker): void {
    this.directedTrack.addMarker(this.position, marker);
  }

  removeMarker(marker: TrackMarker): void {
    this.directedTrack.removeMarker(marker);
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

  persist(): PositionData {
    return {
      trackId: this.directedTrack.getTrack().getId(),
      direction: this.directedTrack.getDirection(),
      position: this.position
    };
  }

  static fromData(data: PositionData, store: Store): PositionOnTrack {
    return PositionOnTrack.fromTrack(
      store.get(data.trackId) as TrackBase,
      data.position,
      data.direction
    );
  }
}
