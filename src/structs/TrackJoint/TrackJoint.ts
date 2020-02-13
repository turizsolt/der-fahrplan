export interface TrackJoint {
  init(x: number, z: number, rot: number);
  rotate(rot: number);
  remove();
  slope();
  equ();
  ww(joint: TrackJoint);
  whichEnd(w: any, one: TrackJoint, other: TrackJoint);
  connect(joint: TrackJoint);
  setOneEnd(jointEnd, track, trackEnd, trackEndName);
  getPosition();
  getRotation();
  getEnds();
  getId();
  isRemoved(): boolean;
}
