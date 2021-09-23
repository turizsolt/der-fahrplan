import { PositionedTrackMarker } from '../PositionedTrackMarker';
import { TrackDirection } from '../Track/TrackDirection';
import { TrackPart } from '../Track/TrackPart';
import { Block } from './Block';

export interface DirectedBlock {
  next(): DirectedBlock;
  setNext(nextBlock: DirectedBlock): void;

  reverse(): DirectedBlock;
  setReverse(reverseBlock: DirectedBlock): void;

  getDirection(): TrackDirection;
  getBlock(): Block;

  getTrackParts(): TrackPart[];
  getMarkers(): PositionedTrackMarker[];
}
