import { DirectedBlock } from './DirectedBlock';
import { TrackDirection } from '../Track/TrackDirection';
import { BlockSegment } from './BlockSegment';
import { Block } from './Block';
import { TrackPart } from '../Track/TrackPart';
import { WhichEnd } from '../../structs/Interfaces/WhichEnd';
import { DirectedTrack } from '../Track/DirectedTrack';
import { PositionedTrackMarker } from '../PositionedTrackMarker';

export class ActualDirectedBlock implements DirectedBlock {
  private nextBlock: DirectedBlock = null;
  private reverseBlock: DirectedBlock = null;

  constructor(
    private segment: BlockSegment,
    private trackDirection: TrackDirection
  ) { }

  next(): DirectedBlock {
    return this.nextBlock;
  }

  setNext(nextBlock: DirectedBlock): void {
    this.nextBlock = nextBlock;
  }

  reverse(): DirectedBlock {
    return this.reverseBlock;
  }

  setReverse(reverseBlock: DirectedBlock): void {
    this.reverseBlock = reverseBlock;
  }

  getDirection(): TrackDirection {
    return this.trackDirection;
  }

  getBlock(): Block {
    return this.segment.getBlock();
  }

  getTrackParts(): TrackPart[] {
    const startBlockEnd = this.getBlock().getEnd(this.getDirection() === TrackDirection.AB ? WhichEnd.A : WhichEnd.B);
    const startJoint = startBlockEnd.getJointEnd().joint;
    const endBlockEnd = this.getBlock().getEnd(this.getDirection() === TrackDirection.AB ? WhichEnd.B : WhichEnd.A);
    const endJoint = endBlockEnd.getJointEnd().joint;
    const positionOnTrack = startJoint.getPosition();

    const startWhichEnd = startBlockEnd.getJointEnd().end;
    const realStartPositionOnTrack = startWhichEnd === WhichEnd.B ? positionOnTrack : positionOnTrack.opposition();
    const directedTracks: DirectedTrack[] = [];
    let realEndPositionOnTrack: number = null;
    let next = realStartPositionOnTrack.getDirectedTrack();
    while (next) {
      directedTracks.push(next);
      const found = next.getMarkers().find(x => x.marker.type === 'BlockJoint' && x.marker.blockJoint === endJoint);
      realEndPositionOnTrack = found?.position;
      if (found) break;
      next = next.next();
    }

    const returning: TrackPart[] = [];
    for (let i = 0; i < directedTracks.length; i++) {
      let startPosition = 0;
      if (i === 0) {
        startPosition = realStartPositionOnTrack.getPosition();
      }
      let endPosition = directedTracks[i].getLength();
      if (i === (directedTracks.length - 1)) {
        endPosition = realEndPositionOnTrack;
      }
      returning.push({ startPosition, endPosition, track: directedTracks[i] });
    }

    return returning;
  }

  getMarkers(): PositionedTrackMarker[] {
    return [].concat(...this.getTrackParts().map(tp => tp.track.getMarkersPartially(tp)));
  }
}
