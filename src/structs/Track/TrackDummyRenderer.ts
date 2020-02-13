import { TrackRenderer } from './TrackRenderer';
import { injectable } from 'inversify';
import { Track } from './Track';

@injectable()
export class TrackDummyRenderer implements TrackRenderer {
  init(_: Track): void {}
  update() {}
}
