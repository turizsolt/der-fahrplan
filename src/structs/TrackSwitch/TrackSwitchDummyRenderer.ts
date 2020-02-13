import { TrackSwitchRenderer } from './TrackSwitchRenderer';
import { injectable } from 'inversify';
import { TrackSwitch } from './TrackSwitch';

@injectable()
export class TrackSwitchDummyRenderer implements TrackSwitchRenderer {
  init(_: TrackSwitch): void {}
  update() {}
}
