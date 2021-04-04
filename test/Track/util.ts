import { TrackJoint } from '../../src/modules/Track/TrackJoint/TrackJoint';
import { TrackBase } from '../../src/modules/Track/TrackBase';
import { Ray } from '../../src/structs/Geometry/Ray';
import { Track } from '../../src/modules/Track/Track';
import { TYPES } from '../../src/di/TYPES';
import { Coordinate } from '../../src/structs/Geometry/Coordinate';
import { WhichEnd } from '../../src/structs/Interfaces/WhichEnd';
import { getTestStore } from '../getTestStore';

const store = getTestStore();

export function createTrack(): {
  jointStart: TrackJoint;
  jointEnd: TrackJoint;
  track: TrackBase;
} {
  const j1 = store
    .create<TrackJoint>(TYPES.TrackJoint)
    .init(Ray.from(0, 0, 0, 0));
  const j2 = store
    .create<TrackJoint>(TYPES.TrackJoint)
    .init(Ray.from(0, 0, 100, 0));
  const track = store.create<Track>(TYPES.Track).init({
    coordinates: [new Coordinate(0, 0, 0), new Coordinate(0, 0, 100)],
    startJointEnd: { joint: j1, end: WhichEnd.A },
    endJointEnd: { joint: j2, end: WhichEnd.B }
  });

  return { jointStart: j1, track, jointEnd: j2 };
}

export function createTrackLine(
  count: number,
  distance: number
): {
  joint: TrackJoint[];
  track: TrackBase[];
} {
  const joint: TrackJoint[] = [];
  for (let i = 0; i < count; i++) {
    joint.push(
      store
        .create<TrackJoint>(TYPES.TrackJoint)
        .init(Ray.from(0, 0, i * distance, 0))
    );
  }

  const track: TrackBase[] = [];
  for (let i = 1; i < count; i++) {
    track.push(
      store.create<Track>(TYPES.Track).init({
        coordinates: [joint[i - 1].getRay().coord, joint[i].getRay().coord],
        startJointEnd: { joint: joint[i - 1], end: WhichEnd.A },
        endJointEnd: { joint: joint[i], end: WhichEnd.B }
      })
    );
  }

  return { joint, track };
}
