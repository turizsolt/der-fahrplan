import { TrackSwitch } from '../Interfaces/TrackSwitch';
import { BaseRenderer } from './BaseRenderer';

export interface TrackSwitchRenderer extends BaseRenderer {
  init(sw: TrackSwitch): void;
}
