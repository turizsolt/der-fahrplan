import { injectable } from 'inversify';
import { WagonRenderer } from '../../src/structs/Renderers/WagonRenderer';
import { Wagon } from '../../src/structs/Interfaces/Wagon';

@injectable()
export class WagonDummyRenderer implements WagonRenderer {
  setSelected(selected: boolean): void {}
  isSelected(): boolean {
    return null;
  }
  process(command: string): void {}
  init(_: Wagon) {}
  update() {}
  remove(): void {}
}
