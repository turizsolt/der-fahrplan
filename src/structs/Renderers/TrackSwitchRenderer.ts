import { TrackSwitch } from '../../modules/Track/TrackSwitch';
import { BaseRenderer } from './BaseRenderer';

export interface TrackSwitchRenderer extends BaseRenderer {
  init(sw: TrackSwitch): void;
}
