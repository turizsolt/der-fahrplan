import { Track } from './Track';
import { BaseRenderer } from '../Base/BaseRenderer';

export interface TrackRenderer extends BaseRenderer {
  init(track: Track): void;
}
