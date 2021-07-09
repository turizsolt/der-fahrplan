import { PositionOnTrack } from './PositionOnTrack';
import { DirectedTrack } from '../Track/DirectedTrack';
import { TrackMarker } from '../Track/TrackMarker';
import { PositionedTrackMarker } from '../PositionedTrackMarker';

export class MarkerIterator {
  private currentDirectedTrack: DirectedTrack;
  private currentIndex: number;

  constructor (
    private startDirectedTrack: DirectedTrack, 
    private startPosition?: number, 
    private endDirectedTrack?: DirectedTrack, 
    private endPosition?: number,
    private dtCondition?: (dt:DirectedTrack) => boolean
  ) {
    this.currentDirectedTrack = startDirectedTrack;
    this.currentIndex = -1;

    if(!dtCondition) {
        this.dtCondition = (dt:DirectedTrack) => true;
    }
  }

  static fromPositionOnTrack(startPoT: PositionOnTrack, endPoT?: PositionOnTrack): MarkerIterator {
    return new MarkerIterator(
      startPoT.getDirectedTrack(), 
      startPoT.getPosition(), 
      endPoT?.getDirectedTrack(), 
      endPoT?.getPosition()
    );
  }

  next(): PositionedTrackMarker {
    let value:PositionedTrackMarker = null;
    do {
      value = this.innerNext();
    }
    while(value && !this.conditions(value));

    return value;
  }

  private conditions(value: PositionedTrackMarker): boolean {
      if(this.startPosition &&
        this.currentDirectedTrack === this.startDirectedTrack
         && value.position < this.startPosition) {
          return false;
      }

      if(this.endPosition &&
        this.currentDirectedTrack === this.endDirectedTrack
         && value.position > this.endPosition) {
          return false;
      }

      return true;
  }

  private innerNext(): PositionedTrackMarker {
    let markers = this.currentDirectedTrack?.getMarkers();
    this.currentIndex++;
    while (markers && this.currentIndex >= markers.length) {
      this.currentIndex = 0;
      // stop on the last dt
      if(this.currentDirectedTrack === this.endDirectedTrack) {
        return undefined;
      }
      this.currentDirectedTrack = this.currentDirectedTrack.next();
      // finish, if dt is not ok
      if(!this.dtCondition(this.currentDirectedTrack)) {
        return undefined;
      }
      markers = this.currentDirectedTrack?.getMarkers();
    }
    return markers && markers[this.currentIndex];
  }

  nextOf(type: string): PositionedTrackMarker {
      let value:PositionedTrackMarker = null;
      do {
        value = this.next();
      }
      while(value && value.marker && value.marker.type !== type);

      return value;
  }

  nextOfFull(type: string): {value: TrackMarker, directedTrack: DirectedTrack, position: number, positionOnTrack: PositionOnTrack} {
    let value:PositionedTrackMarker = null;
    do {
      value = this.next();
    }
    while(value && value.marker && value.marker.type !== type);

    return {
        value: value?.marker,
        position: value?.position,
        directedTrack: this.currentDirectedTrack,
        positionOnTrack: value && new PositionOnTrack(this.currentDirectedTrack, value.position)
    };
  }
}
