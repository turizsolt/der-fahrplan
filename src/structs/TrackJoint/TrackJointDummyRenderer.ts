import { TrackJoint } from './TrackJoint';
import { TrackJointRenderer } from './TrackJointRenderer';
import { injectable } from 'inversify';

@injectable()
export class TrackJointDummyRenderer implements TrackJointRenderer {
  init(_: TrackJoint): void {}
  update() {}
}
