import { TrackSwitch } from './TrackSwitch';

export interface TrackSwitchRenderer {
  init(sw: TrackSwitch): void;
  update();
}
