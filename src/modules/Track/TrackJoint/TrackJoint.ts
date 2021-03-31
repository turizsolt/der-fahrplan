import { WhichEnd } from '../../../structs/Interfaces/WhichEnd';
import { TrackBase } from '../TrackBase';
import { Ray } from '../../../structs/Geometry/Ray';
import { Coordinate } from '../../../structs/Geometry/Coordinate';
import { BaseBrick } from '../../../structs/Interfaces/BaseBrick';
import { Emitable } from '../../../mixins/Emitable';
import { ActualTrackEnd } from '../ActualTrackEnd';

export interface TrackJoint extends BaseBrick, Emitable {
  init(ray: Ray): TrackJoint;

  getRay(): Ray;
  getPosition(): Coordinate;
  getRotation(): number;

  getTracksEnd(track: TrackBase): WhichEnd | undefined;

  getEnd(whichEnd: WhichEnd): ActualTrackEnd;
  setOneEnd(jointEnd: WhichEnd, trackEnd: ActualTrackEnd): void;
  removeEnd(trackEnd: ActualTrackEnd): void;
}
