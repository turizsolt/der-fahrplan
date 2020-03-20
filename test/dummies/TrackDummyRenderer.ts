import { TrackRenderer } from '../../src/structs/Renderers/TrackRenderer';
import { injectable } from 'inversify';
import { Track } from '../../src/structs/Interfaces/Track';

@injectable()
export class TrackDummyRenderer implements TrackRenderer {
  setSelected(selected: boolean): void {}
  isSelected(): boolean {
    return false;
  }
  process(command: string): void {}
  init(_: Track): void {}
  update(): void {}
  remove(): void {}
}
