import { WhichEnd } from '../Track/WhichEnd';
import { TrackEnd } from '../Track/TrackEnd';
import { TrackBase } from '../TrackBase/TrackBase';

export interface TrackJoint {
  init(x: number, z: number, rot: number): TrackJoint;
  rotate(rot: number);
  remove();
  isRemovable(): boolean;
  removeEnd(end: TrackEnd): void;
  slope();
  equ();
  computeMidpoint(joint: TrackJoint);
  whichEnd(w: any, one: TrackJoint, other: TrackJoint);
  connect(joint: TrackJoint);
  setOneEnd(jointEnd: WhichEnd, trackEnd: TrackEnd);
  getPosition();
  getRotation();
  getEnds();
  getId();
  isRemoved(): boolean;
  select(): void;
  deselect(): void;
  isSelected(): boolean;
  verbose(): void;
  getId(): string;
  getTracksEnd(track: TrackBase): WhichEnd | undefined;
}
