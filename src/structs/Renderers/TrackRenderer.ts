import { Track } from '../Interfaces/Track';
import { BaseRenderer } from './BaseRenderer';

export interface TrackRenderer extends BaseRenderer {
  init(track: Track): void;
}
