import { injectable } from 'inversify';
import { WagonRenderer } from '../../src/structs/Renderers/WagonRenderer';
import { WagonData } from '../../src/modules/Train/WagonData';

@injectable()
export class SignalDummyRenderer implements WagonRenderer {
  setSelected(selected: boolean): void {}
  isSelected(): boolean {
    return null;
  }
  process(command: string): void {}
  init(_: WagonData) {}
  update() {}
  remove(): void {}
}
