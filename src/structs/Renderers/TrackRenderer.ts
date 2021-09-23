import { Track } from '../../modules/Track/Track';
import { BaseRenderer } from './BaseRenderer';

export interface TrackRenderer extends BaseRenderer {
  init(track: Track): void;
}
