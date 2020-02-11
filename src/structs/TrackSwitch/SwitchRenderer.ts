import { TrackSwitch } from './TrackSwitch';

export interface SwitchRenderer {
  init(sw: TrackSwitch): void;
  update();
}
