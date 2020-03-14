import { injectable } from 'inversify';
import { WagonRenderer } from './WagonRenderer';
import { Wagon } from './Wagon';

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
