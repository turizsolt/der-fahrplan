import { TrackSwitchRenderer } from '../../src/structs/Renderers/TrackSwitchRenderer';
import { injectable } from 'inversify';
import { TrackSwitch } from '../../src/structs/Interfaces/TrackSwitch';

@injectable()
export class TrackSwitchDummyRenderer implements TrackSwitchRenderer {
  setSelected(selected: boolean): void {}
  isSelected(): boolean {
    return false;
  }
  process(command: string): void {}
  init(_: TrackSwitch): void {}
  update() {}
  remove(): void {}
}
