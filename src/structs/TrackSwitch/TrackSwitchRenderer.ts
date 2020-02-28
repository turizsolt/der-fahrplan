import { TrackSwitch } from './TrackSwitch';
import { BaseRenderer } from '../Base/BaseRenderer';

export interface TrackSwitchRenderer extends BaseRenderer {
  init(sw: TrackSwitch): void;
}
