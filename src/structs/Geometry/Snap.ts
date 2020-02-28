import { Ray } from './Ray';
import { Coordinate } from './Coordinate';
import { TrackBase } from '../TrackBase/TrackBase';
import { TrackJoint } from '../TrackJoint/TrackJoint';
import { ActualTrack } from '../Track/ActualTrack';
import { TrackSwitch } from '../TrackSwitch/TrackSwitch';

export function snapXZ(p: Ray): Ray {
  return new Ray(new Coordinate(snap(p.coord.x), 0, snap(p.coord.z)), p.dirXZ);
}

function snap(p) {
  const diff = p % 5;
  if (diff < 2.5 || diff >= 2.5) return Math.round(p / 5) * 5;
  return p;
}

export function snapPositionOnTrack(p: Ray, trackList: TrackBase[]) {
  let distance = Infinity;
  let track = null;
  let position = null;
  let segment = null;

  for (let thisTrack of trackList) {
    if (thisTrack.constructor.name === ActualTrack.name) {
      const linePoints = thisTrack
        .getSegment()
        .getBezier()
        .getLinePoints();
      for (let i = 0; i < linePoints.length; i++) {
        const c = p.coord.distance2d(linePoints[i]);

        if (c < distance) {
          distance = c;
          track = thisTrack;
          position = (i / (linePoints.length - 1)) * track.getLength();
        }
      }
    } else {
      const linePoints = (thisTrack as TrackSwitch)
        .getSegmentE()
        .getBezier()
        .getLinePoints();
      for (let i = 0; i < linePoints.length; i++) {
        const c = p.coord.distance2d(linePoints[i]);

        if (c < distance) {
          distance = c;
          track = thisTrack;
          position = (i / (linePoints.length - 1)) * track.getLength();
          segment = 'E';
        }
      }

      const linePoints2 = (thisTrack as TrackSwitch)
        .getSegmentF()
        .getBezier()
        .getLinePoints();
      for (let i = 0; i < linePoints2.length; i++) {
        const c = p.coord.distance2d(linePoints2[i]);

        if (c < distance) {
          distance = c;
          track = thisTrack;
          position = (i / (linePoints2.length - 1)) * track.getLength();
          segment = 'F';
        }
      }
    }
  }

  if (distance < 5) {
    return {
      distance,
      position,
      track,
      segment
    };
  } else return null;
}

export function snapJoint(p: Ray, jointList: TrackJoint[]) {
  const snapped = snapXZ(p);

  for (let joint of jointList) {
    if (joint.getPosition().equalsTo(snapped.coord)) return joint;
  }

  return null;
}
