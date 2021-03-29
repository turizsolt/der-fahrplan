import { WhichEnd } from '../../../structs/Interfaces/WhichEnd';
import { TrackEnd } from '../TrackEnd';
import { TrackBase } from '../TrackBase';
import { Ray } from '../../../structs/Geometry/Ray';
import { TrackJointEnd } from './TrackJointEnd';
import { Coordinate } from '../../../structs/Geometry/Coordinate';
import { BaseBrick } from '../../../structs/Interfaces/BaseBrick';
import { Emitable } from '../../../mixins/Emitable';

export interface TrackJoint extends BaseBrick, Emitable {
  init(ray: Ray): TrackJoint;

  getRay(): Ray;
  getPosition(): Coordinate;
  getRotation(): number;

  getEnds(): Record<WhichEnd, TrackJointEnd>;
  getTracksEnd(track: TrackBase): WhichEnd | undefined;
  setOneEnd(jointEnd: WhichEnd, trackEnd: TrackEnd): void;
  removeEnd(end: TrackEnd): void;
}
