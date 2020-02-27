import { WhichEnd } from '../Track/WhichEnd';
import { TrackEnd } from '../Track/TrackEnd';
import { TrackBase } from '../TrackBase/TrackBase';
import { Ray } from '../Geometry/Ray';
import { TrackJointEnd } from './TrackJointEnd';
import { Coordinate } from '../Geometry/Coordinate';

export interface TrackJoint {
  init(x: number, z: number, rot: number): TrackJoint;
  rotate(rot: number): void;
  remove(): void;
  isRemovable(): boolean;
  removeEnd(end: TrackEnd): void;

  connect(joint: TrackJoint): any;
  setOneEnd(jointEnd: WhichEnd, trackEnd: TrackEnd): void;
  getRay(): Ray;
  getPosition(): Coordinate;
  getRotation(): number;
  getEnds(): Record<WhichEnd, TrackJointEnd>;
  getId(): string;
  isRemoved(): boolean;
  select(): void;
  deselect(): void;
  isSelected(): boolean;
  verbose(): void;
  getId(): string;
  getTracksEnd(track: TrackBase): WhichEnd | undefined;

  isEndEmpty(end: TrackJointEnd): boolean;
  areBothEndsEmpty(oneEnd, otherEnd: TrackJointEnd): boolean;
}
