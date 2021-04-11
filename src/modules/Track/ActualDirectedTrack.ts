import { TrackSegment } from './TrackSegment';
import { DirectedTrack } from './DirectedTrack';
import { TrackBase } from './TrackBase';
import { TrackCurve } from './TrackCurve';
import { TrackDirection } from './TrackDirection';
import { TrackMarker } from './TrackMarker';
import { PositionedTrackMarker } from '../PositionedTrackMarker';

export class ActualDirectedTrack implements DirectedTrack {
  private nextTrack: DirectedTrack = null;
  private reverseTrack: DirectedTrack = null;

  constructor(
    private segment: TrackSegment,
    private curve: TrackCurve,
    private trackDirection: TrackDirection
  ) {}

  next(): DirectedTrack {
    return this.nextTrack;
  }

  setNext(nextTrack: DirectedTrack): void {
    this.nextTrack = nextTrack;
  }

  reverse(): DirectedTrack {
    return this.reverseTrack;
  }

  setReverse(reverseTrack: DirectedTrack): void {
    this.reverseTrack = reverseTrack;
  }

  getSegment(): TrackSegment {
    return this.segment;
  }

  getTrack(): TrackBase {
    return this.segment.getTrack();
  }

  getCurve(): TrackCurve {
    return this.curve;
  }

  getLength(): number {
    return this.curve.getLength();
  }

  getDirection(): TrackDirection {
    return this.trackDirection;
  }

  private markers: PositionedTrackMarker[] = [];

  addMarker(position: number, marker: TrackMarker): void {
    this.markers.push({ position, marker });
    this.markers.sort((a, b) => a.position - b.position);
  }

  removeMarker(marker: TrackMarker): void {
    this.markers = this.markers.filter(x => x.marker !== marker);
  }

  addMarkerBothDirections(position: number, marker: TrackMarker): void {
    this.addMarker(position, marker);
    this.reverseTrack?.addMarker(this.getLength() - position, marker);
  }

  removeMarkerBothDirections(marker: TrackMarker): void {
    this.removeMarker(marker);
    this.reverseTrack?.removeMarker(marker);
  }

  getMarkers(): PositionedTrackMarker[] {
    return this.markers;
  }
}
