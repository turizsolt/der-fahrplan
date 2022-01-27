import { TrackSegment } from './TrackSegment';
import { DirectedTrack } from './DirectedTrack';
import { TrackBase } from './TrackBase';
import { TrackCurve } from './TrackCurve';
import { TrackDirection } from './TrackDirection';
import { TrackMarker } from './TrackMarker';
import { PositionedTrackMarker } from '../PositionedTrackMarker';
import { TrackPart } from './TrackPart';
import { almostBetween } from '../../structs/Geometry/Almost';

export class ActualDirectedTrack implements DirectedTrack {
  private nextTrack: DirectedTrack = null;
  private permaNextTracks: DirectedTrack[] = [];
  private reverseTrack: DirectedTrack = null;

  constructor(
    private segment: TrackSegment,
    private curve: TrackCurve,
    private trackDirection: TrackDirection
  ) { }

  next(): DirectedTrack {
    return this.nextTrack;
  }

  setNext(nextTrack: DirectedTrack): void {
    this.nextTrack = nextTrack;
  }

  permaNexts(): DirectedTrack[] {
    return this.permaNextTracks;
  }

  setPermaNexts(permaNextTracks: DirectedTrack[]): void {
    this.permaNextTracks = permaNextTracks;
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
    // todo unify
    this.markers = this.markers.filter(x => (
      (!x.marker.train || x.marker.train !== marker.train) &&
      (!x.marker.blockJoint || x.marker.blockJoint !== marker.blockJoint) &&
      (!x.marker.platform || x.marker.platform !== marker.platform) &&
      (!x.marker.sensor || x.marker.sensor !== marker.sensor) &&
      (!x.marker.signal || x.marker.signal !== marker.signal)
    ));
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

  getMarkersPartially(part: TrackPart): PositionedTrackMarker[] {
    return this.markers.filter(m => almostBetween(part.startPosition, m.position, part.endPosition));
  }

  getHash(): string {
    return this.getTrack().getHash(this.getSegment()) + '-' + this.getDirection();
  }

}
