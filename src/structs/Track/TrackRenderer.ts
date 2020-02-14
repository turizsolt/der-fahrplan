import { Track } from './Track';

export interface TrackRenderer {
  init(track: Track): void;
}
