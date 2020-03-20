import { WhichEnd } from '../Interfaces/WhichEnd';
import { TrackEnd } from '../Actuals/Track/TrackEnd';
import { TrackBase } from './TrackBase';
import { Ray } from '../Geometry/Ray';
import { TrackJointEnd } from '../Actuals/TrackJoint/TrackJointEnd';
import { Coordinate } from '../Geometry/Coordinate';
import { BaseBrick } from './BaseBrick';

export interface TrackJoint extends BaseBrick {
  init(x: number, z: number, rot: number): TrackJoint;
  rotate(rot: number): void;
  remove(): boolean;
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
  getTracksEnd(track: TrackBase): WhichEnd | undefined;

  isEndEmpty(end: TrackJointEnd): boolean;
  areBothEndsEmpty(oneEnd, otherEnd: TrackJointEnd): boolean;
}
