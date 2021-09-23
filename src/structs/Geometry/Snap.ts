import { Ray } from './Ray';
import { Coordinate } from './Coordinate';
import { TrackBase } from '../../modules/Track/TrackBase';
import { TrackJoint } from '../../modules/Track/TrackJoint/TrackJoint';
import { ActualTrack } from '../../modules/Track/ActualTrack';
import { TrackSwitch } from '../../modules/Track/TrackSwitch';

export function snapXZ(p: Ray): Ray {
  return new Ray(new Coordinate(snap(p.coord.x), 0, snap(p.coord.z)), p.dirXZ);
}

function snap(p) {
  const diff = p % 5;
  if (diff < 2.5 || diff >= 2.5) return Math.round(p / 5) * 5;
  return p;
}

export function snapHexaXZ(p: Ray): Ray {
  const a = snapHexaHeight(p.coord.z) / HEIGHT;
  const par = a % 2 === 0 ? 0 : WIDTH / 2;
  return new Ray(
    new Coordinate(snapHexaWidth(p.coord.x, par), 0, snapHexaHeight(p.coord.z)),
    p.dirXZ
  );
}

const HEIGHT = (10 * Math.sqrt(3)) / 2;
const WIDTH = 10;

function snapHexaHeight(p) {
  return Math.round(p / HEIGHT) * HEIGHT;
}

function snapHexaWidth(p, par) {
  return Math.round((p - par) / WIDTH) * WIDTH + par;
}

export function snapPositionOnTrack(p: Ray, trackList: TrackBase[]) {
  let distance = Infinity;
  let track = null;
  let position = null;
  let segment = null;

  for (let thisTrack of trackList) {
    if (thisTrack.constructor.name === ActualTrack.name) {
      const linePoints = thisTrack
        .getCurve()
        .getBezier()
        .getLineSegmentChain()
        .getPoints();
      for (let i = 0; i < linePoints.length; i++) {
        const c = p.coord.distance2d(linePoints[i]);

        if (c < distance) {
          distance = c;
          track = thisTrack;
          position = i / (linePoints.length - 1);
        }
      }
    } else {
      const linePoints = (thisTrack as TrackSwitch)
        .getSegmentLeft()
        .getBezier()
        .getLineSegmentChain()
        .getPoints();
      for (let i = 0; i < linePoints.length; i++) {
        const c = p.coord.distance2d(linePoints[i]);

        if (c < distance) {
          distance = c;
          track = thisTrack;
          position = i / (linePoints.length - 1);
          segment = 'E';
        }
      }

      const linePoints2 = (thisTrack as TrackSwitch)
        .getSegmentRight()
        .getBezier()
        .getLineSegmentChain()
        .getPoints();
      for (let i = 0; i < linePoints2.length; i++) {
        const c = p.coord.distance2d(linePoints2[i]);

        if (c < distance) {
          distance = c;
          track = thisTrack;
          position = i / (linePoints2.length - 1);
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
  const snapped = snapHexaXZ(p);

  for (let joint of jointList) {
    if (joint.getPosition().equalsTo(snapped.coord)) return joint;
  }

  return null;
}
